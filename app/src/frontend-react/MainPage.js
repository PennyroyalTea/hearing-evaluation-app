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

    finishTest(result) {
        console.log(`test finished ${result}`)
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
                    pathList={this.state.savedPathList}
                    testRunner={p=>this.runTest(p)}
                    pathUpdater={path=>this.setState({savedPathList: path})}
                />) : (
                    <Spin delay={200}/>
                )
            case 'test':
                return (<TestPage
                    testMode={this.state.testMode}
                    testPath={this.state.testPath}
                    config={this.state.testConfig}
                    testEnder={result=>this.finishTest(result)}
                />)
            default:
                return <Empty description='Exception: Wrong mode in MainPage'/>
        }
    }
}

export default MainPage;