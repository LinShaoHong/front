export default {
  data() {
    return {
      audio: null,
      audioPlaying: false,
      audioInterval: null,
      audioCurrent: null,
      audioDuration: null
    }
  },
  onLoad() {
    this.audio = uni.createInnerAudioContext();
    this.audio.onCanplay(() => {
      this.audioDuration = this.audio.duration;
    });

    this.audio.onPlay(() => {
      this.audioPlaying = true;
      this.audioInterval = setInterval(() => {
        this.audioCurrent = this.audio.currentTime;
      }, 1000);
    });

    this.audio.onEnded(() => {
      this.audioPlaying = false;
      this.onAudioEnded();
    });

    this.audio.onStop(() => {
      this.audioPlaying = false;
      if (this.audioInterval) {
        clearInterval(this.audioInterval);
      }
    });

    this.audio.onPause(() => {
      this.audioPlaying = false;
      if (this.audioInterval) {
        clearInterval(this.audioInterval);
      }
    });
  },
  onUnload() {
    this.clearAudio();
  },
  beforeDestroy() {
    this.clearAudio();
  },
  onBackPress() {
    this.clearAudio();
  },
  onHide() {
    if (this.audio) {
      this.audio.pause();
    }
  },
  methods: {
    clearAudio() {
      if (this.audio) {
        this.audio.destroy();
      }
      if (this.audioInterval) {
        clearInterval(this.audioInterval);
      }
    }
  }
}