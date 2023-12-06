export default {
  data() {
    return {
      recorder: null,
      recording: false,
      recorderPath: null,
      recorderStartTime: 0,
      recorderInterval: null,
      recorderAudio: null,
      recorderAudioPlaying: false,
      recorderAudioInterval: null,
      recorderAudioCurrent: null,
      recorderAudioDuration: null
    }
  },
  onLoad() {
    this.recorder = uni.getRecorderManager();

    this.recorder.onStart(res => {
      this.recording = true;
      this.recorderStartTime = new Date().getTime();
      this.recorderInterval = setInterval(() => {
        const duration = new Date().getTime() - this.recorderStartTime;
        if (duration >= 10 * 1000) {
          this.recorder.stop();
        }
      }, 1000);
    });

    this.recorder.onStop(res => {
      this.recorderPath = res.tempFilePath;
      this.recording = false;
      this.onRecorderStop();
      if (this.recorderInterval) {
        clearInterval(this.recorderInterval);
      }
    });

    this.recorderAudio = uni.createInnerAudioContext();
    this.recorderAudio.onCanplay(() => {
      this.recorderAudioDuration = this.recorderAudio.duration;
    });

    this.recorderAudio.onPlay(() => {
      this.recorderAudioPlaying = true;
      this.recorderAudioInterval = setInterval(() => {
        this.recorderAudioCurrent = this.recorderAudio.currentTime;
      }, 1000);
    });

    this.recorderAudio.onEnded(() => {
      this.recorderAudioPlaying = false;
    });

    this.recorderAudio.onStop(() => {
      this.recorderAudioPlaying = false;
      if (this.recorderAudioInterval) {
        clearInterval(this.recorderAudioInterval);
      }
    });

    this.recorderAudio.onPause(() => {
      this.recorderAudioPlaying = false;
      if (this.recorderAudioInterval) {
        clearInterval(this.recorderAudioInterval);
      }
    });
  },
  onUnload() {
    this.clearRecorderAudio();
  },
  beforeDestroy() {
    this.clearRecorderAudio();
  },
  onBackPress() {
    this.clearRecorderAudio();
  },
  onHide() {
    if (this.recorder) {
      this.recorder.stop();
    }

    if (this.recorderAudio) {
      this.recorderAudio.pause();
    }
  },
  methods: {
    clearRecorderAudio() {
      if (this.recorder) {
        this.recorder.stop();
      }

      if (this.recorderAudio) {
        this.recorderAudio.destroy();
      }

      if (this.recorderAudioInterval) {
        clearInterval(this.recorderAudioInterval);
      }
    }
  }
}