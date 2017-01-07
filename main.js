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
import ituc_ranking from './ituc_data_2016.js'

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

var ITUC_DFLT =  "???";

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
            cca2: 'NO',

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
    getITUCMeaning(score){
        var meaning = '';
        if(score==='???'){
            meaning === ''
        } else {
            score = parseInt(score);
            if(score===1){
                meaning = 'Irregular violation of rights';
            }else if (score ===2){
                meaning = 'Repeated violation of rights';
            }else if (score ===3){
                meaning = 'Regular violation of rights';
            }else if(score ==4){
                meaning = 'Systematic violation of rights';
            }else if(score === 5){
                meaning = 'No guarantee of rights';
            }else if(score === 6){
                meaning = 'No guarantee of rights due to the breakdown of the rule of law';

            }
        }
        return meaning
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
    getVerdict(score, ituc_elem){
        score = parseFloat(score.replace(/\*/gi, ''));
        ituc_elem = parseFloat(ituc_elem)
        if(score>=8 && ituc_elem > 4){
            return 'Go for it!'
        }else if(score>=6 && ituc_elem > 4){
            return 'Sounds good.'
        }else if(score>=5 && ituc_elem > 4){
            return 'Probably okay'
        }else if(score>=4){
            return 'Proceed with caution ...'
        }else if(score==0){
            return 'No data available'
        }else {
            return 'Look for alternatives.'
        }
    }
    render(){
        if(this.props.data.hasOwnProperty(this.state.country)){
            var elem = this.props.data[this.state.country];
        } else {
            var elem = DFLT;
        }

        if(this.props.ituc_ranking.hasOwnProperty(this.state.country)){
            var ituc_elem = this.props.ituc_ranking[this.state.country]
        } else {
            var ituc_elem = ITUC_DFLT;
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
            <Text>{this.state.country === 'Democracy' ? '': "Recommendation: " + this.getVerdict(elem['score'], ituc_elem)}
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
            <Text>{this.state.country === 'Democracy' ? '': '   Source: Economist Intelligence Unit'}</Text>
            </TouchableHighlight>
            <TouchableHighlight
            onPress={(index=>Communications.web('https://www.ituc-csi.org/ituc-global-rights-index-workers'))}
        >
            <Text>{this.state.country === 'Democracy' ? '': "ITUC Global Rights: " + ituc_elem + ' (' + this.getITUCMeaning(ituc_elem) + ')'}</Text>
            </TouchableHighlight>
            </View>
            );
    }
}

class App extends React.Component {
    render() {
        return ( <MainView data={data} ituc_ranking={ituc_ranking}/>);
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
