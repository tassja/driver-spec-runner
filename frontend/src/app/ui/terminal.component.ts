import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    ViewChild,
    ElementRef,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import { Terminal } from 'xterm';
import { BaseClass } from 'src/app/common/base.class';

@Component({
    selector: 'a-terminal',
    template: `
        <div name="terminal" class="w-full h-full overflow-hidden" #container (window:resize)="resizeTerminal()">
            <div class="terminal" #terminal></div>
        </div>
    `,
    styles: [
        `
            [name="terminal"] {
                background-color: #212121;
            }

            .terminal {
                max-width: 100%;
                min-height: 100%;
            }
        `,
    ],
})
export class TerminalComponent
    extends BaseClass
    implements OnInit, OnChanges, OnDestroy {
    /** Contents to display on the terminal */
    @Input() public content: string;
    /** Resizes terminal display on change */
    @Input() public resize: boolean;
    /** Local instance of an xterm terminal */
    public terminal: Terminal;

    @ViewChild('terminal', { static: true })
    public terminal_element: ElementRef<HTMLDivElement>;
    @ViewChild('container', { static: true }) public container_el: ElementRef<
        HTMLDivElement
    >;

    public ngOnInit(): void {
        if (this.terminal) {
            this.ngOnDestroy();
        }
        this.terminal = new Terminal({
            theme: {
                background: `#212121`,
                red: '#e53935',
                blue: '#1e88e5',
                yellow: '#fdd835',
                green: '#43a047',
            },
            fontSize: 14,
        });
        this.terminal.open(this.terminal_element.nativeElement);
        this.timeout('init', () => {
            this.resizeTerminal();
            this.updateTerminalContents(this.content || '');
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.content) {
            this.updateTerminalContents(this.content || '');
        }
        if (changes.resize) {
            this.timeout('resize', () => this.resizeTerminal());
        }
    }

    public ngOnDestroy(): void {
        this.terminal.clear();
        this.terminal.dispose();
    }

    /**
     * Resize the terminal display to fill the container element
     */
    public resizeTerminal(): void {
        if (!this.terminal || !this.container_el) {
            return;
        }
        const font_size = this.terminal.getOption('fontSize');
        const line_height = this.terminal.getOption('lineHeight');
        const box = this.container_el.nativeElement.getBoundingClientRect();
        const width = Math.floor(box.width / (font_size * 0.6));
        const height = Math.floor(
            box.height / (line_height * font_size * 1.2)
        );
        this.terminal.resize(width - 2, height);
    }

    /**
     * Update the rendered contents of the terminal view
     * @param new_content New contents to render
     */
    private updateTerminalContents(new_content: string) {
        if (!this.terminal) {
            return;
        }
        this.terminal.clear();
        const lines: string[] = new_content.split('\n');
        for (const line of lines) {
            this.terminal.writeln(line);
        }
        this.timeout('scroll', () => this.terminal.scrollToBottom(), 50);
    }
}
