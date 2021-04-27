import React from 'react';

import {Empty, Spin} from 'antd'


import {FolderMenu} from './FolderMenu'
import {TestPage} from './TestPage'


class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'menu', // menu | test
            savedPathList: undefined,
            testMode: undefined, // practice | exam
            testFile: undefined,
            testConfig: undefined
        }
    }

    runTest(params) {
        let {testMode, testPath, config} = params
        console.log(`run test params: ${JSON.stringify(params)}`)
        this.setState({
            mode: 'test',
            testMode: testMode,
            testPath: testPath,
            testConfig: config
        })
    }

    async finishTest(testMode, result) {
        console.log(`test finished mode ${testMode} | result ${JSON.stringify(result)}`)
        if (testMode === 'exam') {
            await window.backend.saveTestResult(result);
        }
        this.setState({
            mode: 'menu'
        })
    }

    render() {
        switch (this.state.mode) {
            case 'menu':
                return this.props.tfolder.status === 'ok' ? (
                    <FolderMenu
                    tfolder={this.props.tfolder}
                    currentUser={this.props.currentUser}
                    pathList={this.state.savedPathList}
                    testRunner={p=>this.runTest(p)}
                    pathUpdater={path=>this.setState({savedPathList: path})}
                />) : (
                    <Spin delay={200}/>
                )
            case 'test':
                return (<TestPage
                    tfolder={this.props.tfolder}
                    testMode={this.state.testMode}
                    config={this.state.testConfig}
                    currentUser={this.props.currentUser}
                    testEnder={(testMode, result)=>this.finishTest(testMode, result)}
                />)
            default:
                return <Empty description='Exception: Wrong mode in MainPage'/>
        }
    }
}

export default MainPage;