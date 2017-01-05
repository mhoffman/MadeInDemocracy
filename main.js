import Exponent from 'exponent';
import React from 'react';
import Communications from 'react-native-communications';
import {
    Alert,
    StyleSheet,
    Text,
    View,
    Picker,
    Platform,
    NativeModules,
    TouchableHighlight,
} from 'react-native';
import ReactNative from 'react-native';
import { Entypo, FontAwesome, Ionicons, MaterialIcons, Foundation  } from '@exponent/vector-icons';
import CountryPicker from 'react-native-country-picker-modal';
import worldCountries from 'world-countries';
import LocalizedStrings from 'react-native-localization'

import rawData from './democracy_index_2015.js'

var I18n = require('react-native-i18n');
I18n.fallbacks = true
let interfaceLanguage = I18n.currentLocale();

I18n.translations = {
    en: {
        madeIn: 'Made In'
    },
    de: {
        madeIn: 'Hergestellt in'
    },
    po: {
        madeIn: 'Feito em'
    },

};

var cca2Name = {}
worldCountries.map((country) => {
    cca2Name[country.cca2] = country.name.common
});

var DFLT = {
            "rank": "???",
            "id": "???",
            "score": "0",
            "electoralProcessandPluralism": "???",
            "functioningOfgovernment": "???",
            "politicalparticipation": "???",
            "politicalculture": "???",
            "civilliberties": "???",
            "category": "???"
        };

var handler = {
    get: function(target, name) {
        return target.hasOwnProperty(name) ? target[name] : {
            "rank": "???",
            "id": name,
            "score": "0",
            "electoralProcessandPluralism": "???",
            "functioningOfgovernment": "???",
            "politicalparticipation": "???",
            "politicalculture": "???",
            "civilliberties": "???",
            "category": "???"
        };
    }
};

/*var data = new Proxy(rawData, handler);*/
var data = rawData;



class MainView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            country: 'Democracy',
            cca2: 'US',

        };
    }
    getIcon(score){
        score = parseFloat(score.replace(/\*/gi, ''));
        if(score>=8){
            return <Entypo name='emoji-flirt'/>
        }else if(score>=6){
            return <Entypo name='emoji-happy'/>
        }else if(score>=5){
            return <Entypo name='emoji-neutral'/>
        }else if(score>=4){
            return <FontAwesome name='warning'/>
        }else {
            return <Entypo name='emoji-sad'/>
        }
    }
    getColor(score){
        score = parseFloat(score.replace(/\*/gi, ''));
        color = 'white'
            if(score>=8){
                color = 'green';
            }else if(score>=6){
                color = 'greenyellow';
            }else if(score>=4){
                color = 'yellow';
            }else if(score>0) {
                color = 'red';
            }else if(score==0) {
                color = 'grey';
            }
        return color;
    }
    getVerdict(score){
        score = parseFloat(score.replace(/\*/gi, ''));
        if(score>=8){
            return 'Go for it!'
        }else if(score>=6){
            return 'Sounds good.'
        }else if(score>=5){
            return 'Probably okay'
        }else if(score>=4){
            return 'Proceed with caution ...'
        }else if(score==0){
            return 'No data availaible'
        }else {
            return 'Try to avoid.'
        }
    }
    render(){
        if(this.props.data.hasOwnProperty(this.state.country)){
            var elem = this.props.data[this.state.country];
        } else {
            var elem = DFLT;
        }
        return (
                <View style={styles.container}>
                <View
                style={{
                    backgroundColor: this.state.country === 'Democracy'? 'white' : this.getColor(elem['score'])
                }}
                >
                <ReactNative.Text>{I18n.t('madeIn')} {this.state.country}</ReactNative.Text>
                </View>
                <View
                >
                <CountryPicker
                onChange={(value)=> { console.log(value); this.setState({country: cca2Name[value.cca2], cca2: value.cca2})}}
                cca2={this.state.cca2}
                translation={interfaceLanguage}
                />
                {/*
                    <Picker
                    selectedValue={this.state.country}
                    onValueChange={(country) => this.setState({country})}
                    >
                    {Object.keys(this.props.data).sort().map((country, i) =>
                    {
                    return <Picker.Item
                    key={i} label={country} value={country}
                    />
                    })}
                    </Picker> */}
        </View>
            <Text>{this.state.country === 'Democracy' ? '': "Recommendation: " + this.getVerdict(elem['score'])}
        </Text>
            <Text>{this.state.country === 'Democracy' ? '': "Overall score: " + elem['score']}</Text>
            <Text>{this.state.country === 'Democracy' ? '': "   Electoral Process and Pluralism: " + elem['electoralProcessandPluralism']}</Text>
            <Text>{this.state.country === 'Democracy' ? '': "   Functioning of Government: " + elem['functioningOfgovernment']}</Text>
            <Text>{this.state.country === 'Democracy' ? '': "   Political Participation: " + elem['politicalparticipation']}</Text>
            <Text>{this.state.country === 'Democracy' ? '': "   Civil Liberties: " + elem['civilliberties']}</Text>
            <Text>{this.state.country === 'Democracy' ? '': "   Category: " + elem['category']}</Text>
            <TouchableHighlight
            onPress={(index)=>Communications.web('https://en.wikipedia.org/wiki/Democracy_Index')}
        >
            <Text>{this.state.country === 'Democracy' ? '': "   Source: Democracy Index " + interfaceLanguage}</Text>
            </TouchableHighlight>
            </View>
            );
    }
}

class App extends React.Component {
    render() {
        return ( <MainView data={data}/>);
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingTop: 50,
        flex: 1,
        backgroundColor: '#fff',
    },
});

Exponent.registerRootComponent(App);
