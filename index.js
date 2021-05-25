const { Plugin } = require('powercord/entities');
const Settings = require('./Settings');
const constVars = Object.freeze({
  VIDEO_SUBCOMMANDS: {
    pause: {
      funcName: "pauseVideo",
      command: "pause",
      autocomplete: "pause",
      description: "Pauses the current background video"
    },
    play: {
      funcName: "playVideo",
      command: "play",
      autocomplete: "play",
      description: "Plays the current background video"
    },
    url: {
      funcName: "setVideoUrl",
      command: "url",
      autocomplete: "url",
      description: "Sets the current background video url",
      arginstructions: "url for the video"
    },
    volume: {
      funcName: "setVideoVolume",
      command: "volume",
      autocomplete: "volume",
      description: "Sets the current background video volume",
      arginstructions: "volume between 0 and 100 (decimals allowed)"
    },
  }
});
module.exports = class VideoBg extends Plugin {

  startPlugin () {
    Settings.prototype.setVideoVolume = this.setVideoVolume.bind(this)
    Settings.prototype.setVideoUrl = this.setVideoUrl.bind(this)
    Settings.prototype.setVideoFit = this.setVideoFit.bind(this)
    this.registerMain();
    const bgElement = document.querySelector("div.bg-h5JY_x");
    const videoElement = document.createElement("video");
    videoElement.autoplay = true;
    videoElement.controls = false;
    videoElement.loop = true;
    videoElement.volume = this.settings.get('videoVolume', '')/100;
    videoElement.style = `width:100%;height:100%;object-fit:${this.settings.get('videoFit', 'contain')};`;
    videoElement.src = this.settings.get('videoUrl', '');
    this.bgVideoElement = bgElement.appendChild(videoElement);
  }

  pluginWillUnload () {
    this.bgVideoElement.remove();
    powercord.api.commands.unregisterCommand('video');
    powercord.api.settings.unregisterSettings('videobg');
  }

  registerMain() {
    powercord.api.commands.registerCommand({
      command: 'video',
      description: 'Check subcommands for more',
      usage: `{c} [ ${Object.keys(constVars.VIDEO_SUBCOMMANDS).join(" | ")} ]`,
      executor: this.commandHandler.bind(this),
      autocomplete: this.autocompleteHandler.bind(this)
    });
    powercord.api.settings.registerSettings('videobg', {
        category: this.entityID, label: 'Video Background', render: Settings });
  }

  commandHandler(args) {
    const subcommand = args.shift().toLowerCase();
    if (Object.keys(constVars.VIDEO_SUBCOMMANDS).includes(subcommand)) {
      this[constVars.VIDEO_SUBCOMMANDS[subcommand].funcName].apply(this,args)
    }
  }

  autocompleteHandler(args) {
    if (args[0] === void 0) return false;
    if (args.length === 1) {
      return {
        commands: Object.keys(constVars.VIDEO_SUBCOMMANDS).filter(e=>e.includes(args[0])).map(e=>{return constVars.VIDEO_SUBCOMMANDS[e]}),
        header: 'video subcommands'
      }
    }
    if (args[1]) return false;
    const subcommand = constVars.VIDEO_SUBCOMMANDS[args[0]];
    if (!subcommand || subcommand.arginstructions === void 0) {
      return false;
    }
    return {
      commands: [ {
        command: subcommand.arginstructions,
        instruction: true
      } ]
    }
  }

  setVideoUrl(u) {
    this.settings.set('videoUrl', u)
    this.bgVideoElement.src = u;
  }
  setVideoVolume(v) {
    this.settings.set('videoVolume', v)
    this.bgVideoElement.volume = Math.min(Math.max(parseFloat(v)/100, 0), 1);
  }
  setVideoFit(s) {
    this.settings.set('videoFit', s);
    this.bgVideoElement.style = `width:100%;height:100%;object-fit:${s};`;
  }
  pauseVideo() {
    this.bgVideoElement.pause();
  }
  playVideo() {
    this.bgVideoElement.play();
  }
  
};
