import React, { useEffect, useState } from "react";
import { RecordRTCPromisesHandler } from "recordrtc";
import styled from "styled-components";

let recorder;

const H1 = styled.h1`
  font-family: sans-serif;
  font-size: 48px;
  text-align: center;
`;

const Button = styled.button`
  background: black;
  border-radius: 0;
  border: 0;
  color: white;
  cursor: pointer;
  font-size: 18px;
  padding: 16px 32px;
  width: 256px;
`;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Audio = styled.audio`
  margin-top: 32px;
`;

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState();

  useEffect(() => {
    (async function() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return new RecordRTCPromisesHandler(stream, { type: "audio" });
    })().then(result => (recorder = result));

    return () => recorder.destroy();
  }, []);

  const handleRecordButtonClick = async () => {
    if (!recorder instanceof RecordRTCPromisesHandler) return;
    if (!isRecording) {
      recorder.startRecording();
      setIsRecording(true);
    } else {
      await recorder.stopRecording();
      setAudioBlob(URL.createObjectURL(await recorder.getBlob()));
      setIsRecording(false);
    }
  };

  return (
    <>
      <H1>Audio Recording Demo</H1>
      <Container>
        <Button onClick={handleRecordButtonClick}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        {audioBlob && <Audio controls autoplay playsInline src={audioBlob} />}
      </Container>
    </>
  );
};

export default App;
