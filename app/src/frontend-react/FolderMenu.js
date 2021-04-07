import React from "react";

import {List as ImmutableList} from "immutable";

import {Button, Card, Col, List, Row, Spin, Typography} from "antd";

const path = require('path');

const {Title} = Typography;

export class FolderMenu extends React.Component {
    constructor(props) {
        const pathList = props.pathList || ImmutableList()

        super(props);
        this.state = {
            loaded: false,
            tree: undefined,
            curPathList: pathList,
            testCard: undefined,
        }
    }

    async componentDidMount() {
        await this.loadFolderStructure()
    }

    async loadFolderStructure() {
        const res = await window.backend.loadDirStructure(this.props.tfolder.path)
        this.setState({
            loaded: true,
            tree: res
        })
    }

    async loadTestFile(testFilePath) {
        return await window.backend.loadJson(path.join(testFilePath, 'config.json'));
    }

    getEntryByPath(tree, path) {
        let cur = tree
        for (let go of path) {
            const nextEntry = cur.content.find(elem => elem.name === go)
            if (nextEntry) {
                cur = nextEntry
            } else {
                return null
            }
        }
        return cur
    }

    renderEntry(entry) {
        let btnType = (entry.type === 'test' ? 'primary' : '');
        let onClick;
        if (entry.type === 'test') {
            onClick = () => this.setState({testCard: entry});
        } else {
            onClick = () => {
                const nextPath =  this.state.curPathList.push(entry.name);
                this.props.pathUpdater(nextPath)
                this.setState({testCard: null, curPathList: nextPath})

            }
        }

        return (<List.Item style={{justifyContent:'center'}}>
            <Button
                type={btnType}
                onClick={onClick}
                size='large'
            >
                {entry.name}
            </Button>
        </List.Item>)
    }

    render() {
        let content;

        if (!this.state.loaded) {
            content = <Spin delay={100} size="large"/>
        } else {
            const entry = this.getEntryByPath(this.state.tree, this.state.curPathList)
            content = (<List
                header = {<Title>{entry.name}</Title>}
                dataSource={entry.content}
                renderItem={(item) => this.renderEntry(item)}
            />)
        }

        let rightCol;
        if (this.state.testCard) {
            let testPath = path.join.apply(
                null,
                [this.props.tfolder.path].concat(this.state.curPathList.toJS()).concat(['~'.concat(this.state.testCard.name)])
            );

            rightCol = ( <Card
                title={this.state.testCard.name}
                actions={[
                    <Button
                        onClick={async ()=>this.props.testRunner({
                            testMode: 'practice',
                            testPath: testPath,
                            config: await this.loadTestFile(testPath)
                        })}
                    >Тренировка</Button>,
                    <Button
                        onClick={async ()=>this.props.testRunner({
                            testMode: 'exam',
                            testPath: testPath,
                            config: await this.loadTestFile(testPath)
                        })}
                    >Тест</Button>
                ]}
            >

                {this.state.testCard.description}
            </Card>)
        }

        let leftCol = undefined;
        if (this.state.curPathList.size > 0) {
            leftCol = ( <Button
                onClick={()=>(this.setState({curPathList: this.state.curPathList.pop()}))}
            >Назад</Button>)
        }

        return (
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={8} align={'right'}>
                    {leftCol}
                </Col>
                <Col span={8}>
                    {content}
                </Col>
                <Col span={8}>
                    {rightCol}
                </Col>
            </Row>
        )
    }
}
