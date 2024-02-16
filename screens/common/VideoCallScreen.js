import React, { useState, useEffect } from "react";
import { DeviceEventEmitter, View } from "react-native";

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from "react-native-webrtc";
import firestore from "@react-native-firebase/firestore";
// import { db } from "../../util/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteField,
} from "firebase/firestore";

import CallActionBox from "../../components/ui/CallActionBox";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { addDocument, editDocument } from "../../util/firestoreWR";
import { useDispatch } from "react-redux";
import { updateAppointment } from "../../store/redux/appointmentSlice";
import {
  APPOINTMENT_STATUS,
  FIREBASE_COLLECTION,
} from "../../constants/constants";
import InCallManager from "react-native-incall-manager";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function VideoCallScreen({ route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [cachedLocalPC, setCachedLocalPC] = useState();

  const [isMuted, setIsMuted] = useState(false);
  const [isOffCam, setIsOffCam] = useState(false);

  const { roomId, currentAppointment } = route.params;

  useEffect(() => {
    console.log("Starting here video call");
    startLocalStream();
  }, []);

  useEffect(() => {
    console.log("localStream and roomId", localStream, roomId);
    if (localStream && roomId) {
      startCall(roomId);
    }
  }, [localStream]);

  useEffect(() => {},[remoteStream,localStream])

  //End call button
  async function endCall() {
    if (cachedLocalPC) {
      const senders = cachedLocalPC.getSenders();
      senders.forEach((sender) => {
        cachedLocalPC.removeTrack(sender);
      });
      cachedLocalPC.close();
    }

    const roomRef = firestore().collection("room").doc(roomId);
    await roomRef.update({ answer: firestore.FieldValue.delete() });

    await roomRef.delete();

    dispatch(
      updateAppointment({
        ...currentAppointment,
        changes: { appointment_status: APPOINTMENT_STATUS.COMPLETED },
      })
    );
    editDocument(FIREBASE_COLLECTION.APPOINTMENT, currentAppointment.id, {
      appointment_status: APPOINTMENT_STATUS.COMPLETED,
    });

    setLocalStream();
    setRemoteStream(); // set remoteStream to null or empty when callee leaves the call
    setCachedLocalPC();
    // cleanup
    navigation.goBack(); //go back to previous screen
    DeviceEventEmitter.emit("onCallOrJoin", currentAppointment);
    DeviceEventEmitter.removeAllListeners("onCallOrJoin");
  }

  //start local webcam on your device
  const startLocalStream = async () => {
    console.log("Requesting permission for camera and microphone");
    // isFront will determine if the initial camera should face user or environment
    const isFront = true;
    const devices = await mediaDevices.enumerateDevices();

    const facing = isFront ? "front" : "environment";
    const videoSourceId = devices.find(
      (device) => device.kind === "videoinput" && device.facing === facing
    );
    const facingMode = isFront ? "user" : "environment";
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
  };

  async function recreatePeerConnection() {
    const roomRef = firestore().collection("room").doc(id);

    const callerCandidatesCollection = firestore()
      .collection("room")
      .doc(id)
      .collection("callerCandidates");

    const calleeCandidatesCollection = firestore()
      .collection("room")
      .doc(id)
      .collection("calleeCandidates");

    const localPC = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach((track) => {
      localPC.addTrack(track, localStream);
    });

    localPC.addEventListener("icecandidate", (e) => {
      if (!e.candidate) {
        console.log("Got final candidate!");
        return;
      }
      callerCandidatesCollection.add(e.candidate.toJSON());
    });

    localPC.ontrack = (e) => {
      const newStream = new MediaStream();
      e.streams[0].getTracks().forEach((track) => {
        newStream.addTrack(track);
      });
      setRemoteStream(newStream);
      console.log("Got remote stream", newStream);
    };

    const offer = await localPC.createOffer();
    await localPC.setLocalDescription(offer);

    await roomRef.set({ offer, connected: false }, { merge: true });

    calleeCandidatesCollection.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((snapshot) => {
        if (snapshot.data()) {
          const candidate = new RTCIceCandidate(snapshot.data());
          localPC.addIceCandidate(candidate);
        }
      });
    });

    setCachedLocalPC(localPC);
  }

  const startCall = async (id) => {
    const localPC = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach((track) => {
      localPC.addTrack(track, localStream);
    });

    const roomRef = firestore().collection("room").doc(id);
    const callerCandidatesCollection = firestore()
      .collection("room")
      .doc(id)
      .collection("callerCandidates");
    const calleeCandidatesCollection = firestore()
      .collection("room")
      .doc(id)
      .collection("calleeCandidates");

    localPC.addEventListener("icecandidate", (e) => {
      if (!e.candidate) {
        console.log("Got final candidate!");
        return;
      }
      callerCandidatesCollection.add(e.candidate.toJSON());
    });

    localPC.ontrack = (e) => {
      const newStream = new MediaStream();
      e.streams[0].getTracks().forEach((track) => {
        newStream.addTrack(track);
      });
      console.log("Got remote stream here at video call screen", newStream);
      setRemoteStream(newStream);
    };

    const offer = await localPC.createOffer();
    await localPC.setLocalDescription(offer);

    await roomRef.set({ offer, connected: false }, { merge: true });

    // Listen for remote answer
    roomRef.onSnapshot(async (doc) => {
      const data = doc.data();
      if (!localPC.currentRemoteDescription && data.answer) {
        console.log(
          "Got remote answer--------------------------------------------------------------------------------------------------------------------------------------------------"
        );
          console.log("remote answer here", data.answer)
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        localPC.setRemoteDescription(rtcSessionDescription);
        console.log(remoteStream, "remoteStream here")
        
      } else if (!data.answer && data.leftRoom) {
        console.log("No remote answer here");
        localPC.setRemoteDescription(null);
        localPC.setLocalDescription(null);
        setRemoteStream(null);
        endCall()
      }
    });

    // when answered, add candidate to peer connection
    calleeCandidatesCollection.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((snapshot) => {
        if (snapshot.data()) {
          console.log("Host adding guest IceCandidates " + snapshot.data() )
          const candidate = new RTCIceCandidate(snapshot.data());
          localPC.addIceCandidate(candidate);
        }
      });
    });

    setCachedLocalPC(localPC);
  };

  const switchCamera = () => {
    localStream.getVideoTracks().forEach((track) => track._switchCamera());
  };

  // Mutes the local's outgoing audio
  const toggleMute = () => {
    if (!remoteStream) {
      return;
    }
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  const toggleCamera = () => {
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsOffCam(!isOffCam);
    });
  };

  React.useEffect(() => {
    InCallManager.start({ media: "video" });
    InCallManager.setSpeakerphoneOn(true);
    InCallManager.setForceSpeakerphoneOn(true);
  }, []);

  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        backgroundColor: "black",
      }}
    >
      {!remoteStream && (
        <RTCView
          style={{ flex: 1 }}
          streamURL={localStream && localStream.toURL()}
          objectFit={"cover"}
        />
      )}

      {remoteStream && (
        <>
          <RTCView
            style={{ flex: 1 }}
            streamURL={remoteStream && remoteStream.toURL()}
            objectFit={"cover"}
          />
          {!isOffCam && (
            <RTCView
              style={{
                width: "20%",
                height: "30%",
                position: "absolute",
                right: 8,
                top: 8,
              }}
              streamURL={localStream && localStream.toURL()}
            />
          )}
        </>
      )}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          flexDirection: "row",
        }}
      >
        <CallActionBox
          switchCamera={switchCamera}
          toggleMute={toggleMute}
          toggleCamera={toggleCamera}
          endCall={endCall}
        />
      </View>
    </View>
  );
}
