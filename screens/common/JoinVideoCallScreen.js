import React, { useState, useEffect } from "react";
import { Alert, View } from "react-native";

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from "react-native-webrtc";
import firestore from "@react-native-firebase/firestore";
import { db } from "../../util/firebaseConfig";
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

import InCallManager from 'react-native-incall-manager'
import CallActionBox from "../../components/ui/CallActionBox";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { addDocument, editDocument, fetchDocument } from "../../util/firestoreWR";
import { firebase } from "@react-native-firebase/auth";
import { useDispatch } from "react-redux";
import { updateAppointment } from "../../store/redux/appointmentSlice";
import { APPOINTMENT_STATUS } from "../../constants/constants";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function JoinVideoCallScreen({ route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [cachedLocalPC, setCachedLocalPC] = useState();

  const [isMuted, setIsMuted] = useState(false);
  const [isOffCam, setIsOffCam] = useState(false);

  const { roomId } = route.params;

  useEffect(() => {
    startLocalStream();
  }, []);

  useEffect(() => {
    if (localStream) {
      joinCall(roomId);
    }
  }, [localStream]);

  

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
    roomRef.update({ answer: firestore.FieldValue.delete(), connected: false });

   
    // const roomRef = doc(db, "room", roomId);
    // await updateDoc(roomRef, { answer: deleteField() });

    setLocalStream();
    setRemoteStream(); // set remoteStream to null or empty when callee leaves the call
    setCachedLocalPC();
    // cleanup
    navigation.goBack(); //go back to previous screen
  }

  //start local webcam on your device
  const startLocalStream = async () => {
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

  const joinCall = async (id) => {

    const roomRef = firestore().collection("room").doc(id);
    const roomSnapshot = await roomRef.get()
    // const roomSnapshot = fetchDocument("room", id);
    // const roomRef = doc(db, "room", id);
    // const roomSnapshot = await getDoc(roomRef);

    if (!roomSnapshot.exists){
      Alert.alert("Room not found");
      navigation.goBack();
    } 
    const localPC = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach((track) => {
      localPC.addTrack(track, localStream);
    });

    const callerCandidatesCollection = firestore().collection("room").doc(id).collection("callerCandidates");
    const calleeCandidatesCollection = firestore().collection("room").doc(id).collection("calleeCandidates");

    localPC.addEventListener("icecandidate", (e) => {
      if (!e.candidate) {
        console.log("Got final candidate!");
        return;
      }
      calleeCandidatesCollection.add(e.candidate.toJSON());
    });

    localPC.ontrack = (e) => {
      const newStream = new MediaStream();
      e.streams[0].getTracks().forEach((track) => {
        newStream.addTrack(track);
      });
      setRemoteStream(newStream);
    };

    const offer = roomSnapshot.data().offer;
    await localPC.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await localPC.createAnswer();
    await localPC.setLocalDescription(answer);

    await roomRef.update({ answer: answer, connected: true });
    // await updateDoc(roomRef, { answer, connected: true }, { merge: true });

    callerCandidatesCollection.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((snapshot) => {
        if (snapshot.data()) {
          const candidate = new RTCIceCandidate(snapshot.data());
          localPC.addIceCandidate(candidate);
        }
      });
      // snapshot.docChanges().forEach((change) => {
      //   if (change.type === "added") {
      //     let data = change.doc.data();
      //     localPC.addIceCandidate(new RTCIceCandidate(data));
      //   }
      // });
    });

    callerCandidatesCollection.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((snapshot) => {
        if (snapshot.data()) {
          const candidate = new RTCIceCandidate(snapshot.data());
          localPC.addIceCandidate(candidate);
        }
      });
      // snapshot.docChanges().forEach((change) => {
      //   if (change.type === "added") {
      //     let data = change.doc.data();
      //     localPC.addIceCandidate(new RTCIceCandidate(data));
      //   }
      // });
    });

    // firebase().onSnapshot(callerCandidatesCollection, (snapshot) => {
    //   snapshot.docChanges().forEach((change) => {
    //     if (change.type === "added") {
    //       let data = change.doc.data();
    //       localPC.addIceCandidate(new RTCIceCandidate(data));
    //     }
    //   });
    // });

    roomRef.onSnapshot((doc) => {
      const data = doc.data();
      if (!data.answer) {
        navigation.goBack();
      }
    });

    // firebase().onSnapshot(roomRef, (doc) => {
    //   const data = doc.data();
    //   if (!data.answer) {
    //     navigation.goBack();
    //   }
    // })

    // onSnapshot(callerCandidatesCollection, (snapshot) => {
    //   snapshot.docChanges().forEach((change) => {
    //     if (change.type === "added") {
    //       let data = change.doc.data();
    //       localPC.addIceCandidate(new RTCIceCandidate(data));
    //     }
    //   });
    // });

    // onSnapshot(roomRef, (doc) => {
    //   const data = doc.data();
    //   if (!data.answer) {
    //     navigation.goBack();
    //   }
    // });

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

  const toggleLoudSpeaker = () => {}

  React.useEffect(() =>{
    InCallManager.start({media: 'video'}) 
    InCallManager.setSpeakerphoneOn(true);
    InCallManager.setForceSpeakerphoneOn(true);
  },[])

  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <RTCView
        style={{ flex: 1 }}
        streamURL={remoteStream && remoteStream.toURL()}
        objectFit={"cover"}
      />

      {remoteStream && !isOffCam && (
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
