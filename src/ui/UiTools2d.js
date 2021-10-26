
// ****************************************
// Imports
// ****************************************

// import { ImportOutlined, LineOutlined } from "@ant-design/icons";
import React from "react";
import { connect } from "react-redux";

import StoreActionType from "../store/ActionTypes";
import Tools2dType from "../tools2d/ToolTypes";

import { Button, Card, Row, Col, Tooltip } from "antd";
import { MinusSquareFilled, EditFilled } from '@ant-design/icons';

//******************************************************* */
// Class
//****************************************************** */

class UiTool2d extends React.Component {
    constructor(props){
        super(props);
        this.onCLickButtonTools= this.onCLickButtonTools.bind(this);

        this.state = {
            data: [
                { img: EditFilled, txt: 'intensity', ke: Tools2dType.INTENSITY, msgTp:'Get intensity'},
                { img: MinusSquareFilled, txt: 'distance', ke:Tools2dType.DISTANCE, msgTp: 'Measure distance'},
                { img: MinusSquareFilled, txt:'clear', ke:Tools2dType.CLEAR, msgTp:'Clear all tools'},
            ]
        }
    }

    onCLickButtonTools(evt){
        const btn = evt.target;
        const idx = this.state.data.findIndex(obj => (obj.txt === btn.id));

        if(idx >= 0){
            // set new tools 2d index to global store
            const store = this.props;
            store.dispatch({ type: StoreActionType.SET_2D_TOOLS_INDEX, indexTools2d: idx });
            if( idx === Tools2dType.DEFAULT ){
                store.dispatch({ type: StoreActionType.SET_2D_X_POS, render2dxPos: 0.0 });
                store.dispatch({ type: StoreActionType.SET_2D_Y_POS, render2dyPos: 0.0 });

                const gra = store.graphics2d;
                gra.forceUpdate();
                gra.forceRender();
            }
            if(idx === Tools2dType.CLEAR){
                const gra2d = store.graphics2d;
                if(gra2d !== null){
                    gra2d.clear();
                }
            }
        } // if button index valid
    } // end of onClickButtonTools 

    render(){

        const jsx = 
            <Card title='Tools'>
                <Row>
                    {this.state.data.map(d =>{
                        const jsxBtn =
                            <Button key={d.ke} id={d.txt} onClick={this.onCLickButtonTools} 
                                    style={{height:'50px'}}
                                    >
                                <span id={d.txt}>{d.txt.toUpperCase()}</span>
                                </Button>
                        const msgTooltip = d.msgTp;
                        const jsxTooltip =
                         <Col span={6}>
                            <Tooltip title={msgTooltip} color='cyan'>
                                {jsxBtn}
                            </Tooltip>
                         </Col>

                         return jsxTooltip;
                                
                    })}
                </Row>
            </Card>


        return jsx;
    }
}

export default connect(store => store)(UiTool2d);

