import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

type Screen = 'widget' | 'camera' | 'preview' | 'sent';

const STARTER_PHOTO =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=82';

export default function App() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [screen, setScreen] = useState<Screen>('widget');
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [torch, setTorch] = useState(false);
  const [widgetPhoto, setWidgetPhoto] = useState(STARTER_PHOTO);
  const [draftPhoto, setDraftPhoto] = useState<string | null>(null);
  const { width, height } = useWindowDimensions();
  const widgetSize = Math.min(width - 48, 342);
  const cameraFrameHeight = Math.min(height * 0.59, width * 1.28);

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setScreen('camera');
  };

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.72 });
    if (photo?.uri) {
      setDraftPhoto(photo.uri);
      setScreen('preview');
    }
  };

  const sendPhoto = () => {
    if (draftPhoto) setWidgetPhoto(draftPhoto);
    setScreen('sent');
  };

  if (screen === 'camera') {
    return (
      <View style={styles.cameraScreen}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.cameraSafeArea}>
          <View style={styles.cameraTop}>
            <RoundButton label="‹" accessibilityLabel="Back to widget" onPress={() => setScreen('widget')} />
            <View style={styles.cameraHeading}>
              <Text style={styles.cameraOverline}>A LITTLE HELLO</Text>
              <Text style={styles.cameraTitle}>Share your moment</Text>
            </View>
            <RoundButton label="•••" accessibilityLabel="More options" onPress={() => {}} compact />
          </View>
          <View style={[styles.cameraFrame, { height: cameraFrameHeight }]}>
            <CameraView
              ref={cameraRef}
              style={styles.cameraPreview}
              facing={facing}
              enableTorch={torch}
            />
            <View style={styles.cameraFrameLabel}><Text style={styles.cameraFrameLabelText}>right now</Text></View>
          </View>
          <View style={styles.cameraControls}>
            <RoundButton label="↻" accessibilityLabel="Switch camera" onPress={() => setFacing((value) => (value === 'front' ? 'back' : 'front'))} />
            <Pressable accessibilityRole="button" accessibilityLabel="Take photo" style={styles.shutterOuter} onPress={takePhoto}>
              <View style={styles.shutterInner} />
            </Pressable>
            <RoundButton label="ϟ" active={torch} accessibilityLabel="Toggle flash" onPress={() => setTorch((value) => !value)} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar style="light" />
      {screen === 'widget' && (
        <View style={styles.widgetScreen}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open camera to send a new photo"
            onPress={openCamera}
            style={[styles.widget, { width: widgetSize, height: widgetSize }]}
          >
            <Image source={{ uri: widgetPhoto }} style={styles.photo} />
          </Pressable>
        </View>
      )}

      {screen === 'preview' && draftPhoto && (
        <View style={styles.sheet}>
          <Text style={styles.eyebrow}>A little hello</Text>
          <Text style={styles.title}>Send this to Maya?</Text>
          <Text style={styles.description}>It replaces your last photo on her widget.</Text>
          <Image source={{ uri: draftPhoto }} style={styles.previewPhoto} />
          <View style={styles.sendRow}>
            <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={sendPhoto}><Text style={styles.primaryText}>Send to Maya</Text></Pressable>
            <Pressable accessibilityRole="button" style={styles.retakeButton} onPress={() => setScreen('camera')}><Text style={styles.retakeText}>↻</Text></Pressable>
          </View>
        </View>
      )}

      {screen === 'sent' && (
        <View style={styles.sentScreen}>
          <View style={styles.heart}><Text style={styles.heartText}>♥</Text></View>
          <Text style={styles.eyebrow}>On its way</Text>
          <Text style={styles.title}>Maya has your moment.</Text>
          <Text style={styles.description}>Her home-screen widget will update shortly.</Text>
          <View style={styles.infoCard}><Text style={styles.infoTitle}>Your one current photo</Text><Text style={styles.infoText}>Updated just now · Replace it whenever you like.</Text></View>
          <Pressable accessibilityRole="button" style={styles.fullButton} onPress={() => setScreen('widget')}><Text style={styles.primaryText}>Back home</Text></Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

function RoundButton({ label, onPress, active, compact, accessibilityLabel }: { label: string; onPress: () => void; active?: boolean; compact?: boolean; accessibilityLabel: string }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={[styles.roundButton, compact && styles.roundButtonCompact, active && styles.roundButtonActive]}><Text style={[styles.roundButtonText, compact && styles.roundButtonTextCompact]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#2D183D' },
  widgetScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, backgroundColor: '#2D183D' },
  widget: { borderRadius: 30, overflow: 'hidden', shadowColor: '#130B1A', shadowOpacity: 0.62, shadowRadius: 22, elevation: 13 },
  photo: { width: '100%', height: '100%' },
  cameraScreen: { flex: 1, backgroundColor: '#21182C' },
  cameraSafeArea: { flex: 1, paddingHorizontal: 18, paddingBottom: 16, justifyContent: 'space-between' },
  cameraTop: { flexDirection: 'row', alignItems: 'center', paddingTop: 14, minHeight: 76 },
  cameraHeading: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  cameraOverline: { color: '#F7C65B', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  cameraTitle: { color: '#FFF9F5', fontSize: 18, fontWeight: '800', letterSpacing: -0.35, marginTop: 3 },
  cameraFrame: { overflow: 'hidden', borderRadius: 32, backgroundColor: '#382848', borderWidth: 2, borderColor: '#FFFFFF2E', shadowColor: '#07030B', shadowOpacity: 0.36, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
  cameraPreview: { flex: 1 },
  cameraFrameLabel: { position: 'absolute', top: 16, left: 16, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, backgroundColor: '#21182CBF', borderWidth: 1, borderColor: '#FFFFFF33' },
  cameraFrameLabelText: { color: '#FFF9F5', fontSize: 12, fontWeight: '800', letterSpacing: 0.2 },
  cameraControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 18 },
  roundButton: { width: 52, height: 52, borderRadius: 18, borderWidth: 1, borderColor: '#FFFFFF2E', backgroundColor: '#372847', alignItems: 'center', justifyContent: 'center' },
  roundButtonCompact: { width: 52, height: 52 },
  roundButtonActive: { backgroundColor: '#F7C65B', borderColor: '#F7C65B' },
  roundButtonText: { color: '#FFF9F5', fontSize: 25, fontWeight: '700', marginTop: -2 },
  roundButtonTextCompact: { fontSize: 15, letterSpacing: 1, marginTop: -7 },
  shutterOuter: { width: 82, height: 82, borderRadius: 41, borderWidth: 2, borderColor: '#FFF9F5', backgroundColor: '#FFFFFF20', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#FF7B78', borderWidth: 3, borderColor: '#F7A09B' },
  sheet: { flex: 1, padding: 22, backgroundColor: '#2D183D' },
  eyebrow: { color: '#FFD166', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.4 },
  title: { color: '#FFF9F5', fontSize: 37, fontWeight: '800', letterSpacing: -1.8, lineHeight: 40, marginTop: 9 },
  description: { color: '#D8C7E8', fontSize: 16, lineHeight: 23, marginTop: 10 },
  previewPhoto: { width: '100%', aspectRatio: 1, borderRadius: 29, borderWidth: 3, borderColor: '#FFD166', marginTop: 28 },
  sendRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  primaryButton: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 58, borderRadius: 18, backgroundColor: '#FF6B6B', shadowColor: '#C94C60', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 0 },
  primaryText: { color: '#32182B', fontSize: 16, fontWeight: '900' },
  retakeButton: { width: 63, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: '#FFFFFF22' },
  retakeText: { color: '#FFF9F5', fontSize: 23, fontWeight: '800' },
  sentScreen: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2D183D' },
  heart: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFD166', borderWidth: 13, borderColor: '#FFD16644', marginBottom: 27 },
  heartText: { color: '#24152D', fontSize: 47 },
  infoCard: { alignSelf: 'stretch', backgroundColor: '#FFE6E1', borderRadius: 24, padding: 18, marginVertical: 28 },
  infoTitle: { color: '#24152D', fontSize: 17, fontWeight: '800' },
  infoText: { color: '#24152DBB', fontSize: 14, marginTop: 5 },
  fullButton: { alignSelf: 'stretch', minHeight: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: '#FF6B6B', shadowColor: '#C94C60', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 0 },
});
