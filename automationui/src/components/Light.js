import React from "react";
import { Card, Slider, Switch, Button, Popover } from "antd";
import { BulbOutlined, MinusCircleTwoTone } from "@ant-design/icons";
import { updateLightInfo, deleteLight, getLightInfo } from "../Request";
import { HexColorPicker } from "react-colorful";

const Light = (props) => {
  const [checked, setChecked] = React.useState(props.data.light_status);
  const [brightness, setBrightness] = React.useState(props.data.brightness);
  const [lightInfo, setLightInfo] = React.useState(props.data);
  const [available, setAvailable] = React.useState(true);
  const [lightColor, setLightColor] = React.useState(props.rgbColor);

  const lightDelete = async (lightID) => {
    await deleteLight(lightID);
  };

  const handleColorUpdate = () => {
    updateLightInfo(
      lightInfo.id,
      JSON.stringify({ id: lightInfo.id, color: lightColor })
    )
    .then(res => {
      setLightInfo(res.data);
      //props.websocket.send(JSON.stringify(res.data))
    })
  }

  const content = (
    <HexColorPicker color={lightColor} onChange={setLightColor} onMouseUp={handleColorUpdate}/>
  )

  React.useEffect(() => {
    async function initialSetup() {
      getLightInfo(props.data.id).then(res => {
        setLightInfo(res.data);
        setChecked(res.data.light_status);
        setBrightness(res.data.brightness);
        setLightColor(res.data.color);
      });
      
    }
    initialSetup()
  }, [props.refresh]);

  return (
    <>
      {available ? (
        <Card
          style={{
            width: 200,
            margin: "20px 10px",
            height: "330px",
            borderRadius: "10px",
          }}
          title={
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ margin: 0 }}>{lightInfo.name}</p>
              {props.delete ? (
                <Button
                  size="small"
                  danger
                  type="text"
                  icon={<MinusCircleTwoTone twoToneColor="#ff0000" />}
                  onClick={(e) => {
                    lightDelete(lightInfo.id);
                    setAvailable(false);
                  }}
                />
              ) : (
                <BulbOutlined />
              )}
            </div>
          }
          bordered={false}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h4 style={{ margin: 0 }}>Status</h4>
            <Switch
              checked={checked}
              checkedChildren="ON"
              unCheckedChildren="OFF"
              onChange={(val) => {
                updateLightInfo(
                  lightInfo.id,
                  JSON.stringify({ id: lightInfo.id, light_status: val, brightness: lightInfo.brightness })
                )
                .then(res => {
                  setLightInfo(res.data);
                  //props.websocket.send(JSON.stringify(res.data))
                })
                setChecked(val);
              }}
            />
          </div>
          {props.rgb ?
            <div className="color-picker">
              <h4>Color</h4>
              <Popover trigger="click" content={content} placement="bottom">
                <div
                  className="swatch"
                  style={{ backgroundColor: lightColor }}
                />
              </Popover>
            </div>
          : false}
          <div>
            <h4>Brightness</h4>
            <Slider
              disabled={!checked}
              value={checked ? brightness : 0}
              marks={{ 0: "0%", 100: "100%" }}
              onChange={(val) => setBrightness(val)}
              onAfterChange={(val) => {
                updateLightInfo(
                  lightInfo.id,
                  JSON.stringify({ id: lightInfo.id, brightness: val })
                )
                .then(res => {
                  setLightInfo(res.data);
                  //props.websocket.send(JSON.stringify(res.data))
                })
                
              }}
            />
          </div>
        </Card>
      ) : (
        false
      )}
    </>
  );
};

export default Light;
