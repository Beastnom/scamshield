import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

// Android MVP: paste/share a message into the app and request a server-side investigation.
// It does not read SMS automatically; no SMS permissions are requested.
const API_BASE_URL = 'http://10.0.2.2:8787'; // Android emulator -> host machine. Replace for a physical phone/deployment.
export default function App() {
  const [kind, setKind] = useState('sms');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  async function investigate() {
    setError(''); setReport(null);
    if (!message.trim()) { setError('Paste a message or URL first.'); return; }
    setBusy(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/investigations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ inputType: kind, content: message.trim(), interacted: false }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Investigation failed');
      setReport(data);
    } catch (e) { setError(`${e.message}. Check that the ScamShield backend is running and the API URL is correct.`); }
    finally { setBusy(false); }
  }
  const riskColor = report?.riskLevel === 'High' ? '#ff777f' : report?.riskLevel === 'Medium' ? '#f5c451' : report?.riskLevel === 'Low' ? '#55dda0' : '#b3bdd5';
  return <SafeAreaView style={s.safe}><ExpoStatusBar style="light"/><StatusBar barStyle="light-content"/><ScrollView contentContainerStyle={s.page}>
    <View style={s.header}><View style={s.logo}><Text style={s.logoText}>S</Text></View><View><Text style={s.brand}>ScamShield <Text style={s.ai}>AI</Text></Text><Text style={s.sub}>Detect. Understand. Stay protected.</Text></View></View>
    <Text style={s.title}>Check before you trust.</Text><Text style={s.body}>Investigate suspicious messages with an explainable, multi-stage workflow.</Text>
    <View style={s.card}><Text style={s.label}>WHAT ARE YOU CHECKING?</Text><View style={s.tabs}>{[['sms','SMS / Message'],['email','Email'],['url','URL']].map(([v,label])=><TouchableOpacity key={v} onPress={()=>{setKind(v);setReport(null);setError('');}} style={[s.tab,kind===v&&s.tabOn]}><Text style={[s.tabText,kind===v&&s.tabTextOn]}>{label}</Text></TouchableOpacity>)}</View>
      <TextInput multiline value={message} onChangeText={setMessage} placeholder={kind==='url'?'https://example.com/path':'Paste suspicious text here…'} placeholderTextColor="#8290b3" style={[s.input,kind==='url'&&s.urlInput]} autoCapitalize="none" autoCorrect={false}/>
      <TouchableOpacity disabled={busy} onPress={investigate} style={[s.button,busy&&{opacity:0.65}]}>{busy?<ActivityIndicator color="#fff"/>:<Text style={s.buttonText}>Investigate message  →</Text>}</TouchableOpacity>
      {!!error&&<Text style={s.error}>{error}</Text>}
    </View>
    {report&&<View style={s.card}><View style={s.resultHead}><Text style={[s.risk,{color:riskColor,borderColor:riskColor}]}>{report.riskLevel.toUpperCase()} RISK</Text><Text style={s.score}>{report.score} evidence points</Text></View><Text style={s.resultTitle}>{report.summary}</Text><Text style={s.muted}>Engine: {report.mode}. Points are not a fraud probability.</Text>
      <Text style={s.section}>Warning signs</Text>{report.findings?.length?report.findings.map((f,i)=><View key={`${f.id}-${i}`} style={s.finding}><Text style={s.findingTitle}>{f.label}</Text><Text style={s.muted}>{f.evidence}</Text><Text style={s.source}>{f.source}</Text></View>):<Text style={s.muted}>No configured warning patterns matched. This does not prove safety.</Text>}
      <Text style={s.section}>Recommended next steps</Text>{report.recommendations?.map((r,i)=><Text key={i} style={s.advice}>•  {r}</Text>)}
      <Text style={s.section}>Agent status</Text><Text style={s.muted}>LLM context agent: {report.agentStatus?.llm || 'unknown'}</Text><Text style={s.muted}>URL reputation: not configured</Text>
    </View>}
    <View style={s.notice}><Text style={s.noticeTitle}>Privacy by design</Text><Text style={s.muted}>This Android MVP only analyses text you submit. It does not read SMS automatically. LLM message sharing must be explicitly enabled on the server.</Text></View>
    <Text style={s.footer}>CyberSentinels · Hackathon prototype · Not a guarantee of protection</Text>
  </ScrollView></SafeAreaView>;
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#080d1d'},page:{padding:20,paddingBottom:36},header:{flexDirection:'row',alignItems:'center',gap:12,marginTop:10,marginBottom:32},logo:{width:44,height:44,borderRadius:14,backgroundColor:'#132744',borderWidth:1,borderColor:'#22d3ee',alignItems:'center',justifyContent:'center'},logoText:{color:'#22d3ee',fontSize:25,fontWeight:'900'},brand:{fontSize:20,color:'#f1f5ff',fontWeight:'800'},ai:{color:'#22d3ee'},sub:{fontSize:11,color:'#8e9bbb',marginTop:2},title:{fontSize:29,fontWeight:'800',color:'#f1f5ff',lineHeight:35},body:{fontSize:14,color:'#9ba8c8',lineHeight:21,marginTop:8,marginBottom:20},card:{backgroundColor:'#101831',borderColor:'#263452',borderWidth:1,borderRadius:20,padding:16,marginBottom:16},label:{fontSize:10,fontWeight:'800',letterSpacing:1.2,color:'#8e9bbb',marginBottom:12},tabs:{flexDirection:'row',gap:7,marginBottom:12},tab:{paddingVertical:9,paddingHorizontal:11,borderRadius:20,borderWidth:1,borderColor:'#2a3657'},tabOn:{backgroundColor:'#1b3450',borderColor:'#22d3ee'},tabText:{fontSize:12,color:'#9ba8c8'},tabTextOn:{color:'#f1f5ff',fontWeight:'700'},input:{minHeight:150,textAlignVertical:'top',backgroundColor:'#0a1125',borderWidth:1,borderColor:'#2a3657',borderRadius:12,padding:13,color:'#f1f5ff',fontSize:14},urlInput:{minHeight:64},button:{marginTop:12,backgroundColor:'#315eea',borderRadius:12,padding:15,alignItems:'center',minHeight:50,justifyContent:'center'},buttonText:{color:'#fff',fontWeight:'800',fontSize:14},error:{color:'#ff777f',marginTop:10,fontSize:12},resultHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8},risk:{borderWidth:1,borderRadius:20,paddingHorizontal:10,paddingVertical:5,fontSize:11,fontWeight:'900'},score:{fontSize:11,color:'#8e9bbb'},resultTitle:{fontSize:17,fontWeight:'800',color:'#f1f5ff',marginTop:14},muted:{fontSize:12,color:'#9ba8c8',lineHeight:18,marginTop:5},section:{fontSize:14,fontWeight:'800',color:'#f1f5ff',marginTop:20,marginBottom:8},finding:{borderLeftWidth:2,borderLeftColor:'#22d3ee',paddingLeft:10,paddingVertical:7,marginBottom:6},findingTitle:{color:'#f1f5ff',fontWeight:'700',fontSize:13},source:{fontSize:10,color:'#8290b3',marginTop:3},advice:{fontSize:12,color:'#c9d4ee',lineHeight:19,marginBottom:7},notice:{padding:14,borderRadius:14,backgroundColor:'#111c31',borderWidth:1,borderColor:'#263452'},noticeTitle:{fontSize:13,color:'#22d3ee',fontWeight:'800'},footer:{fontSize:10,color:'#647394',textAlign:'center',marginTop:22}});
