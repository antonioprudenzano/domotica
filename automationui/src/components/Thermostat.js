import React from "react";
import { Card, Slider, Button } from "antd";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { FireOutlined, MinusCircleTwoTone } from "@ant-design/icons";
import {
  updateThermostatInfo,
  getThermostatInfo,
  deleteThermostat,
} from "../Request";
import "react-circular-progressbar/dist/styles.css";

const Thermostat = (props) => {
  const [thermostatInfo, setThermostatInfo] = React.useState(props.data);
  const [tempSet, setTempSet] = React.useState(props.data.temperature_set);
  const [available, setAvailable] = React.useState(true);

  const thermostatDelete = async (thermostatID) => {
    await deleteThermostat(thermostatID);
  };

  React.useEffect(() => {
    async function initialSetup(){
      let response = await getThermostatInfo(props.data.id);
      setThermostatInfo(response.data);
      setTempSet(response.data.temperature_set);
    }
    initialSetup()
  }, [props.refresh]);

  React.useEffect(() => {
    const interval = setInterval(async () => {
      let response = await getThermostatInfo(props.data.id);
      setThermostatInfo(response.data);
      setTempSet(response.data.temperature_set);
    }, 13000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {available ? (
        <Card
          title={
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ margin: 0 }}>Thermostat</p>
              {props.delete ? (
                <Button
                  size="small"
                  danger
                  type="text"
                  icon={
                    <MinusCircleTwoTone
                      twoToneColor="#ff0000"
                      onClick={(e) => {
                        thermostatDelete(thermostatInfo.id);
                        setAvailable(false);
                      }}
                    />
                  }
                />
              ) : (
                <FireOutlined />
              )}
            </div>
          }
          bordered={false}
          style={{
            width: 200,
            margin: "20px 10px",
            height: "330px",
            borderRadius: "10px",
          }}
        >
          <CircularProgressbarWithChildren
            value={thermostatInfo.actual_temperature}
            minValue="10"
            maxValue="30"
            circleRatio={0.75}
            styles={buildStyles({
              rotation: 1 / 2 + 1 / 8,
              trailColor: "#eee",
            })}
          >
            <p
              style={{
                fontSize: 20,
                color: "#3e98c7",
                textAlign: "center",
                paddingTop: 20,
              }}
            >
              <strong>
                Current
                <br />
                {thermostatInfo.actual_temperature}°
              </strong>
            </p>
          </CircularProgressbarWithChildren>
          <h4 style={{ margin: 0 }}>Set temperature</h4>
          <Slider
            value={tempSet}
            min={10}
            max={30}
            marks={{ 10: "10", 30: "30" }}
            onChange={(val) => setTempSet(val)}
            onAfterChange={(val) =>
              updateThermostatInfo(
                thermostatInfo.id,
                JSON.stringify({ temperature_set: val })
              )
            }
          />
        </Card>
      ) : (
        false
      )}
    </>
  );
};

export default Thermostat;
