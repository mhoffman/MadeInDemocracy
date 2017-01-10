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
import fop_data from './fop_2016.js'

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

const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingTop: 50,
        flex: 1,
        backgroundColor: '#fff',
    },
    p: {
        fontSize: 14,
    },
    expl: {
        fontSize: 12,
        color: '#666666',
        fontStyle: 'italic',
        marginTop: 5,
    },
    h2: {
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
    }
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
var FOP_DFLT =  "???";

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
        ituc_elem = parseFloat(ituc_elem);

        console.log(score);
        console.log(ituc_elem);
        if(score>=8 && ituc_elem < 4){
            return 'Go for it!'
        }else if(score>=6 && ituc_elem < 4){
            return 'Sounds good.'
        }else if(score>=5 && ituc_elem < 4){
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

        if(this.props.fop_data.hasOwnProperty(this.state.country)){
            var fop_elem = this.props.fop_data[this.state.country]
        } else {
            var fop_elem = FOP_DFLT;
        }

        return (
                <View style={styles.container}>
                <View
                style={{
                    backgroundColor: this.state.country === 'Democracy'? 'white' : this.getColor(elem['score'])
                }}
                >
                <ReactNative.Text style={styles.h2}>{I18n.t('madeIn')} {this.state.country}</ReactNative.Text>
                </View>
                <View
                >
                <CountryPicker
                onChange={(value)=> { this.setState({country: cca2Name[value.cca2], cca2: value.cca2})}}
                cca2={this.state.cca2}
                translation={interfaceLanguage}
                />
                </View>
                <Text style={styles.p}>{this.state.country === 'Democracy' ? '': "Recommendation: " + this.getVerdict(elem['score'], ituc_elem) + '\n'}
                </Text>

                <TouchableHighlight
                onPress={(index=>Communications.web('http://www.eiu.com/public/topical_report.aspx?campaignid=DemocracyIndex2015'))}
                >
                    <View>
                    <Text style={styles.h2}>{this.state.country === 'Democracy' ? '': 'Democracy'}</Text>
                    <Text style={styles.p}>{this.state.country === 'Democracy' ? '': "Overall score: " + elem['score']}</Text>
                    <Text style={styles.p}>{this.state.country === 'Democracy' ? '': "   Electoral Process and Pluralism: " + elem['electoralProcessandPluralism']}</Text>
                    <Text style={styles.p}>{this.state.country === 'Democracy' ? '': "   Functioning of Government: " + elem['functioningOfgovernment']}</Text>
                    <Text style={styles.p}>{this.state.country === 'Democracy' ? '': "   Political Participation: " + elem['politicalparticipation']}</Text>
                    <Text style={styles.p}>{this.state.country === 'Democracy' ? '': "   Civil Liberties: " + elem['civilliberties']}</Text>
                    <Text style={styles.p}>{this.state.country === 'Democracy' ? '': "   Category: " + elem['category']}</Text>
                    <Text style={styles.expl}>{this.state.country === 'Democracy' ? '': '10: best, 0: worst'}</Text>
                    </View>
                    </TouchableHighlight>





                    <TouchableHighlight
                    onPress={(index=>Communications.web('https://www.ituc-csi.org/ituc-global-rights-index-workers'))}
                >
                    <View>
                    <Text style={styles.h2}>{this.state.country === 'Democracy' ? '': 'Worker Rights'}</Text>

                    <Text style={styles.p}>{this.state.country === 'Democracy' ? '': "\nITUC Global Rights: " + ituc_elem + ' (' + this.getITUCMeaning(ituc_elem) + ')'}</Text>
                            <Text style={styles.expl}>{this.state.country === 'Democracy' ? '': '1: best, 6: worst'}</Text>
                            </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                            onPress={(index=>Communications.web('https://rsf.org/en/ranking'))} >
                            <View>
                            <Text style={styles.h2}>{this.state.country === 'Democracy' ? '': 'Freedom of Press'}</Text>
                            <Text style={styles.p}>{this.state.country === 'Democracy' ? '': "\nWorld Press Freedom Index: " + fop_elem}</Text>
                            <Text style={styles.expl}>{this.state.country === 'Democracy' ? '': '0: best, 100: worst'}</Text>
                            </View>
                            </TouchableHighlight>
                            </View>
                            );
    }
}

class App extends React.Component {
    render() {
        return ( <MainView
                data={data}
                ituc_ranking={ituc_ranking}
                fop_data={fop_data}
                />);
    }
}


Exponent.registerRootComponent(App);
