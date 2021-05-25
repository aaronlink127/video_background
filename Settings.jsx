const { React } = require('powercord/webpack')
const { SwitchItem, TextInput, SliderInput, RadioGroup } = require('powercord/components/settings')

module.exports = class Settings extends React.PureComponent {
    render() {
        return <>
            <TextInput
                note="The video URL that is used for the background"
                defaultValue={ this.props.getSetting('videoUrl', "") }
                onChange={ u => this.setVideoUrl(u) }
            >Video Url</TextInput>
            <SliderInput
            note="The volume of the content being played"
            initialValue={ this.props.getSetting('videoVolume', 0) }
            minValue={ 0 } maxValue={ 100 }
            markers={[ 0, 25, 50, 75, 100 ]}
            onValueChange={ v => this.setVideoVolume(v) }
            >Video Volume</SliderInput>
            <RadioGroup
            note="Changes how the video is scaled to windows of a different aspect ratio"
            value={this.props.getSetting('videoFit', "contain")}
            onChange={s => this.setVideoFit(s.value)}
            options={[
                {name:"Contain",desc:"Content is fit within the window without cropping or stretching",value:"contain"},
                {name:"Cover",desc:"Content is cropped to the window's aspect ratio",value:"cover"},
                {name:"Fill",desc:"Content is stretched to the window's aspect ratio",value:"fill"}]}
            >Video Fit Mode</RadioGroup>
        </>
    }
}
