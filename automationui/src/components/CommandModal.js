import React from "react";
import { ReactMic } from "react-mic";

import { Button, Form, Modal, Input, message } from "antd";

import { recognizeAudio, analyzePhrase } from "../Request";

const CommandModal = (props) => {
  const [loadingAnalyze, setLoadingAnalyze] = React.useState(false);

  //record states
  const [isRecording, setIsRecording] = React.useState(false);
  const [isComputing, setIsComputing] = React.useState(false);

  const [form] = Form.useForm();

  const { TextArea } = Input;

  const audioRecognize = async (audio) => {
    setIsComputing(true);
    console.log(audio);
    var fd = new FormData();
    fd.append("audio", audio.blob);
    await recognizeAudio(fd).then((res) => {
      console.log(res.data);
      form.setFieldsValue({
        phrase: res.data.transcription,
      });
      setIsComputing(false);
    });
  };

  const handleAnalyze = async (values) => {
    setLoadingAnalyze(true);
    let res = await analyzePhrase(JSON.stringify({ phrase: values.phrase }));
    if (res.data.ERROR) {
      message.error("I didn't understand!");
    } else {
      props.onVisibleChange(false);
      if (res.data.roomID === props.currentRoom)
        props.changeRoom(res.data.roomID);
      else if (res.data.roomID === 0) props.changeRoom(props.currentRoom);
      message.success("Command executed");
    }
    setLoadingAnalyze(false);
  };

  return (
    <Modal
      title="Type a command to execute"
      visible={props.visible}
      footer={false}
      onCancel={(e) => {
        !loadingAnalyze && props.onVisibleChange(false);
      }}
      bodyStyle={{ padding: "24px" }}
      destroyOnClose="true"
    >
      <Form id="analyzeForm" onFinish={handleAnalyze} form={form}>
        <Form.Item
          name="phrase"
          rules={[
            {
              required: true,
              message: "Please insert a command to execute",
            },
          ]}
        >
          <TextArea
            rows={4}
            allowClear="true"
            placeholder="e.g. Turn on Kitchen lights"
          />
        </Form.Item>
        <ReactMic
          record={isRecording}
          className="audio-wave"
          onStop={(audioRecorded) => audioRecognize(audioRecorded)}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={(e) => setIsRecording(!isRecording)}
            type="primary"
            loading={isComputing}
          >
            {!isRecording ? "Record" : "Stop Recording"}
          </Button>
          <Form.Item
            style={{
              textAlign: "right",
              marginRight: 10,
              marginBottom: 0,
            }}
          >
            <Button
              type="default"
              onClick={(e) => {
                !loadingAnalyze && props.onVisibleChange(false);
              }}
              style={{ marginRight: 10 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loadingAnalyze}>
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CommandModal;
