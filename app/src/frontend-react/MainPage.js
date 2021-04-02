import React from 'react';

import {Empty} from 'antd'


import {FolderMenu} from './FolderMenu'
import {TestPage} from './TestPage'


class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'menu', // menu | test
            savedPath: undefined,
            testMode: undefined, // practice | exam
            testFile: undefined
        }
    }

    runTest(testConfig) {
        let {testMode, testFile} = testConfig
        this.setState({
            mode: 'test',
            testMode: testMode,
            testFile: testFile
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
                return (<FolderMenu
                    path={this.state.savedPath}
                    testRunner={testConfig=>this.runTest(testConfig)}
                    pathUpdater={path=>this.setState({savedPath: path})}
                />)
            case 'test':
                return (<TestPage
                    testMode={this.state.testMode}
                    testFile={this.state.testFile}
                    testEnder={result=>this.finishTest(result)}
                />)
            default:
                return <Empty description='Exception: Wrong mode in MainPage'/>
        }
    }
}

export default MainPage;