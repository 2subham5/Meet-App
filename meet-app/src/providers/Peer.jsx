import React, { useMemo, useEffect, useState, useCallback } from "react";

export const PeerContext = React.createContext(null);

export const usePeer = () => {
    return React.useContext(PeerContext);
};

export const PeerProvider = (props) => {
    const [remoteStream, setRemoteStream] = useState(null);
    const peer = useMemo(() => new RTCPeerConnection(), []);

    const createOffer = async () => {
        try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            return offer;
        } catch (error) {
            console.error("Error creating offer:", error);
            throw error;
        }
    };

    const createAnswer = async (offer) => {
        try {
            if (peer.signalingState !== "stable") {
                console.error("PeerConnection is not in a stable state for creating an answer.");
                return;
            }
            console.log("remote");
            await peer.setRemoteDescription(offer);
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            return answer;
        } catch (error) {
            console.error("Error creating answer:", error);
            throw error;
        }
    };

    const setRemoteAns = async (ans) => {
        try {
            await peer.setRemoteDescription(ans);
        } catch (error) {
            console.error("Error setting remote answer:", error);
            throw error;
        }
    };

    // To send the stream
    const sendStream = async (stream) => {
        const senders = peer.getSenders();
        const tracks = stream.getTracks();
        for (const track of tracks) {
            if (!senders.find(sender => sender.track === track)) {
                peer.addTrack(track, stream);
            }
        }
    };

    const handleTrackEvent = useCallback((ev) => {
        const streams = ev.streams;
        setRemoteStream(streams[0]);
    }, []);

    useEffect(() => {
        peer.addEventListener('track', handleTrackEvent);

        return () => {
            peer.removeEventListener('track', handleTrackEvent);
        };
    }, [handleTrackEvent, peer]);

    return (
        <PeerContext.Provider value={{ peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream }}>
            {props.children}
        </PeerContext.Provider>
    );
};
