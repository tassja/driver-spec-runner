require "./spec_helper"

module PlaceOS::Drivers::Api
  describe Test do
    with_server do
      it "should list drivers" do
        result = curl("GET", "/test?repository=private_drivers")
        drivers = Array(String).from_json(result.body)
        (drivers.size > 0).should be_true
        drivers.includes?("drivers/place/private_helper_spec.cr").should be_true
      end

      it "should build a driver" do
        result = curl("POST", "/test?repository=private_drivers&driver=drivers/place/private_helper.cr&spec=drivers/place/private_helper_spec.cr&force=true")
        result.status_code.should eq(200)
      end

      it "should have expected output using private_drivers repo" do
        io = IO::Memory.new
        Process.run("/app/bin/report", output: io)
        io.to_s.should eq("running report against localhost:6000 (default repository)\ndiscovering drivers... found 1\nlocating specs... found 0\ncompile drivers/place/spec_helper.cr... \e[32mbuilds\e[0m\n\n\n0 drivers, 0 failures, 0 timeouts, 1 without spec\n")
      end
    end
  end
end
