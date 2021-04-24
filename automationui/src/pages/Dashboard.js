import React from "react";

import {
  getRooms,
  getRoomByID,
  addLight,
  addThermostat,
  addRoom,
  deleteRoom,
} from "../Request";
import {
  Layout,
  Menu,
  Spin,
  Button,
  Drawer,
  Form,
  Select,
  Tabs,
  Input,
  message,
} from "antd";

import "../styles/dashboard.css";

import {
  MenuOutlined,
  HomeOutlined,
  PlusOutlined,
  DeleteOutlined,
  CloseOutlined,
  MinusCircleTwoTone,
  MessageOutlined,
} from "@ant-design/icons";

import Light from "../components/Light";
import Thermostat from "../components/Thermostat";
import CommandModal from "../components/CommandModal";

const { Option } = Select;
const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;

const Dashboard = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [available, setAvailable] = React.useState(false);
  const [currentRoomID, setCurrentRoomID] = React.useState();
  const [rooms, setRooms] = React.useState([]);
  const [roomData, setRoomData] = React.useState({});
  const [activeTab, setActiveTab] = React.useState(1);
  const [addCompOpen, setAddCompOpen] = React.useState(false);
  const [delComp, setDelComp] = React.useState(false);
  const [display, setDisplay] = React.useState(false);
  const [showAnalyze, setShowAnalyze] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

  const tabs = { 1: "addRoomForm", 2: "addCompForm" };

  const refreshRooms = async () => {
    let response = await getRooms();
    setRooms(response.data);
    return response;
  };

  const roomDelete = async (roomID) => {
    await deleteRoom(roomID);
    await refreshRooms();
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleTabs = (id) => {
    setActiveTab(id);
  };

  const changeRoom = async (roomID) => {
    let tmp = await getRoomByID(roomID);
    setRoomData(tmp.data);
    setCurrentRoomID(tmp.data.id);
    setRefresh(!refresh);
  };

  const handleSubmit = async (values) => {
    console.log(values);
    var requestError = false;
    switch (values.device) {
      case "light":
        await addLight(
          JSON.stringify({ room: values.room, name: values.lightName })
        );
        break;
      case "thermostat":
        await addThermostat(JSON.stringify({ room: values.room })).catch(
          (error) => {
            message.error("Another thermostat already exists!");
            requestError = true;
          }
        );
        break;
      default:
        break;
    }
    if (values.room === currentRoomID) {
      changeRoom(values.room);
    }
    if (!requestError) setAddCompOpen(false);
    setDisplay(false);
  };

  const addRoomHandle = async (values) => {
    var requestError = false;
    await addRoom(JSON.stringify({ name: values.room.toLowerCase() })).catch(
      (error) => {
        message.error("A room with the same name already exists!");
        requestError = true;
      }
    );
    await refreshRooms();
    if (!requestError) setAddCompOpen(false);
    setDisplay(false);
  };

  const renderRoomComponents = (component) => {
    if (Object.keys(roomData).length !== 0 && roomData.constructor === Object) {
      switch (component) {
        case "light":
          return roomData.lights.map((item) => {
            return (
              <Light
                key={item.id}
                data={item}
                delete={delComp}
                refresh={refresh}
              />
            );
          });
        case "thermostat":
          return roomData.thermostats.map((item) => {
            return (
              <Thermostat
                key={item.id}
                data={item}
                delete={delComp}
                refresh={refresh}
              />
            );
          });
        default:
          break;
      }
    }
  };

  React.useEffect(() => {
    async function initialSetup() {
      let tmpRooms = await refreshRooms();
      if (tmpRooms.data.length > 0) {
        setCurrentRoomID(tmpRooms.data[0].id);
        await changeRoom(tmpRooms.data[0].id);
      }
      setAvailable(true);
    }
    initialSetup();
  }, []);

  return (
    <>
      {available === false ? (
        <Spin size="large" className="loadBox" />
      ) : (
        <Layout style={{ height: "100%", flexWrap: "wrap" }}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            collapsedWidth={0}
            style={{ overflow: "auto" }}
          >
            <div className="sider-header">
              <HomeOutlined style={{ fontSize: "25px", color: "#ffffff" }} />
              <p
                style={{
                  color: "white",
                  padding: "0px 10px",
                  margin: 0,
                  fontSize: "bold",
                }}
              >
                <strong>Rooms</strong>
              </p>
            </div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={[String(currentRoomID)]}
              selectable={!delComp}
              onClick={(e) => {
                if (!delComp) {
                  changeRoom(e.key);
                  setDelComp(false);
                }
              }}
            >
              {rooms.length > 0
                ? rooms.map((room) => {
                    return (
                      <Menu.Item key={room.id} className="room-menu-item">
                        {room.name.charAt(0).toUpperCase() + room.name.slice(1)}
                        {delComp ? (
                          <Button
                            size="small"
                            danger
                            type="text"
                            icon={
                              <MinusCircleTwoTone
                                twoToneColor="#ff0000"
                                style={{ marginRight: 0 }}
                              />
                            }
                            onClick={(e) => {
                              roomDelete(room.id);
                            }}
                          />
                        ) : (
                          false
                        )}
                      </Menu.Item>
                    );
                  })
                : false}
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-header">
              {React.createElement(MenuOutlined, {
                className: "trigger",
                onClick: toggleCollapsed,
              })}
              <h2 style={{ fontWeight: "bold" }}>
                {Object.keys(roomData).length !== 0 &&
                roomData.constructor === Object
                  ? roomData.name.charAt(0).toUpperCase() +
                    roomData.name.slice(1)
                  : false}
              </h2>
            </Header>
            <Content className="site-layout-content">
              {renderRoomComponents("light")}
              {renderRoomComponents("thermostat")}
              <CommandModal
                visible={showAnalyze}
                onVisibleChange={setShowAnalyze}
                changeRoom={changeRoom}
                currentRoom={currentRoomID}
              />
              <Button
                type="primary"
                shape="circle"
                size={"large"}
                className="commandBtn"
                onClick={(e) => setShowAnalyze(true)}
              >
                <MessageOutlined />
              </Button>
              <Button
                type="primary"
                shape="circle"
                size={"large"}
                className="delBtn"
                danger
                onClick={(e) => setDelComp(!delComp)}
              >
                {delComp ? <CloseOutlined /> : <DeleteOutlined />}
              </Button>
              <Button
                type="primary"
                shape="circle"
                size={"large"}
                className="addBtn"
                onClick={(e) => {
                  setAddCompOpen(true);
                  setDelComp(false);
                }}
              >
                <PlusOutlined />
              </Button>
              <Drawer
                width={360}
                onClose={(e) => {
                  setAddCompOpen(false);
                  setDisplay(false);
                }}
                visible={addCompOpen}
                destroyOnClose="true"
                bodyStyle={{ paddingTop: 5 }}
                footer={
                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <Button
                      onClick={(e) => {
                        setAddCompOpen(false);
                        setDisplay(false);
                      }}
                      style={{ marginRight: 8 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      form={tabs[activeTab]}
                    >
                      Submit
                    </Button>
                  </div>
                }
              >
                <Tabs defaultActiveKey="1" onChange={handleTabs}>
                  <TabPane tab="Add room" key="1">
                    <Form
                      layout="vertical"
                      onFinish={addRoomHandle}
                      onFinishFailed={(e) => setAddCompOpen(true)}
                      id="addRoomForm"
                    >
                      <Form.Item
                        name="room"
                        label="Room"
                        rules={[
                          {
                            required: true,
                            message: "Please choose a name for your room",
                          },
                        ]}
                      >
                        <Input placeholder="Room name" />
                      </Form.Item>
                    </Form>
                  </TabPane>
                  <TabPane tab="Add device" key="2">
                    <Form
                      layout="vertical"
                      onFinish={handleSubmit}
                      onFinishFailed={(e) => setAddCompOpen(true)}
                      id="addCompForm"
                    >
                      <Form.Item
                        name="room"
                        label="Room"
                        rules={[
                          {
                            required: true,
                            message: "Please select a room to add",
                          },
                        ]}
                      >
                        <Select placeholder="Select the room">
                          {rooms.map((room) => {
                            return (
                              <Option key={room.id} value={room.id}>
                                {room.name.charAt(0).toUpperCase() +
                                  room.name.slice(1)}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name="device"
                        label="Smart device type"
                        rules={[
                          {
                            required: true,
                            message: "Please select a device to add",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select the smart device type"
                          onChange={(value) => {
                            value === "light"
                              ? setDisplay(true)
                              : setDisplay(false);
                          }}
                        >
                          <Option value="light">Light</Option>
                          <Option value="thermostat">Thermostat</Option>
                        </Select>
                      </Form.Item>
                      {display ? (
                        <Form.Item
                          name="lightName"
                          label="Light Name"
                          rules={[
                            {
                              required: true,
                              message: "Please choose a name for your light",
                            },
                          ]}
                        >
                          <Input placeholder="Light name" />
                        </Form.Item>
                      ) : (
                        false
                      )}
                    </Form>
                  </TabPane>
                </Tabs>
              </Drawer>
            </Content>
          </Layout>
        </Layout>
      )}
    </>
  );
};

export default Dashboard;
