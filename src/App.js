import React, { Component } from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import emptyHtml from './htmlTemplate';
import './App.css';

// const cssReg=/<style>.*<\/style>/g;
// const jsReg=/<script>.*<\/script>/g;

const cssReg=/<style[^>]*>((.|[\n\r])*)<\/style>/im;
const jsReg=/<script[^>]*>((.|[\n\r])*)<\/script>/im;
const bodyReg=/<body[^>]*>((.|[\n\r])*)<\/body>/im;

class App extends Component {
  state={
    htmlValue:'',
    cssValue:'body{background:red;}',
    jsValue:"console.log('hello world')",
    result:emptyHtml,
  }

  template = iframe => {
    if (!iframe) return;
    const dc = iframe.contentWindow.document;
    dc.body.innerHTML = '';
    dc.open();
    // 把html、js 、css 组合到一起
    //dc.write(this.state.htmlValue);  

    //todo
    // 1.js .html 处理
    // 2.节流
    // 3.node 导入导出替换
  
    // const newHtml=emptyHtml.replace(cssReg,raw=>{
    //    return `<style>${this.state.cssValue}</style>`;
    // });
    dc.write(this.state.result);
    dc.close();
  };

  keyDownHandler=(editor,e,type)=>{
    //console.log(e);
    //if(!e.ctrlKey) return;
    if(e.key!=="Meta") return;

    switch(type){
      case 'css':
          console.log(`保存类型：${type}`);
          const newCss=this.state.result.replace(cssReg,raw=>{
            return `<style>${this.state.cssValue}</style>`;
          });
          this.setState((state, props) => {
            return{
              ...state,
              result:newCss,
            }
          });
      break;
      case 'js':
        console.log(`保存类型：${type}`);
        const newJs=this.state.result.replace(jsReg,raw=>{
          return `<script>${this.state.jsValue}</script>`;
        });
        this.setState((state, props) => {
          return{
            ...state,
            result:newJs,
          }
        });
        break;
      case 'html':
        console.log(`保存类型：${type}`);
        console.log(this.state.htmlValue);
        const newBody=this.state.result.replace(bodyReg,raw=>{
          console.log("正则有进来吗");
          return `<body>${this.state.htmlValue}</body>`;
        });
        this.setState((state, props) => {
          return{
            ...state,
            result:newBody,
          }
      });
      break;
      default:
      break;
    }
  }
  render() {
    const options={
      mode:'html',
      theme:'material',
      lineNumbers:true,
    };
    return (
      <div className="App">
     
       <div className="codeArea">
          <div style={{float:'left',margin:'5px',border:'solid 1px red',width:'30%',height:'300px'}}>
            <CodeMirror
                value={this.state.htmlValue}
                options={options}
            
                onBeforeChange={(editor, data, value) => {
                  this.setState((state, props) => {
                    return{
                      ...state,
                      htmlValue:value,
                    }
                  });

                }}
                // onKeyDown={(editor,e)=>{
                //   if(e.ctrlKey){
                //     console.log("可以保存啦");
                //   }
                //  }
                // }
                onKeyDown={(editor,e)=>this.keyDownHandler(editor,e,"html")}
              />
          </div>
          <div style={{float:'left',margin:'5px',border:'solid 1px red',width:'30%',height:'300px'}}>
            <CodeMirror
                value={this.state.cssValue}
                options={options}
             
                onBeforeChange={(editor, data, value) => {
                  console.log("this is onChange event");
                  // this.setState({
                  //   htmlValue:this.state.htmlValue,
                  //   jsValue:this.state.jsValue,
                  //   cssValue:value,
                  // });
                  this.setState((state, props) => {
                    return{
                      ...state,
                      cssValue:value,
                    }
                  });
                }}
                onKeyDown={(editor,e)=>this.keyDownHandler(editor,e,"css")}
              />
          </div>
          <div style={{float:'left',margin:'5px',border:'solid 1px red',width:'30%',height:'300px'}}>
            <CodeMirror
                value={this.state.jsValue}
                options={options}
                // onBeforeChange={(editor, data, value) => {
                //   console.log('this is onBeforeChange event');
                //   this.setState({value});
                // }}
                onBeforeChange={(editor, data, value) => {
                  // this.setState({
                  //   htmlValue:this.state.htmlValue,
                  //   jsValue:value,
                  //   cssValue:this.state.cssValue,
                  // });
                  this.setState((state, props) => {
                    return{
                      ...state,
                      jsValue:value,
                    }
                  });

                }}
                onKeyDown={(editor,e)=>this.keyDownHandler(editor,e,"js")}
              />
          </div>
        </div>
        <div className="iframResult">
          <iframe
            scrolling="no"
            title="title1"
            id="id1"
            ref={ifr => this.template(ifr)}
          />
        </div>
      </div>
    );
  }
}

export default App;
