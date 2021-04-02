import React from "react";

import {List as ImmutableList} from "immutable";

import {mockFolderStructure, mockTestDescription} from "./Mock";

import {Button, Card, Col, List, Row, Spin, Typography} from "antd";

const {Title} = Typography;

export class FolderMenu extends React.Component {
    constructor(props) {
        const path = props.path || ImmutableList()

        super(props);
        this.state = {
            loaded: false,
            tree: undefined,
            curPath: path,
            testCard: undefined,
            testRunner: props.testRunner,
            pathUpdater: props.pathUpdater
        }
    }

    async componentDidMount() {
        await this.loadFolderStructure()
    }

    async loadFolderStructure() {
        //    TODO: attach actual backend
        const res = await mockFolderStructure()
        this.setState({
            loaded: true,
            tree: res
        })
    }

    async loadTestFile(filename) {
        // TODO: attach actual backend
        const res = await mockTestDescription()
        return res
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
                const nextPath =  this.state.curPath.push(entry.name);
                this.state.pathUpdater(nextPath)
                this.setState({testCard: null, curPath: nextPath})

            }
        }

        return (<List.Item>
            <Button
                type={btnType}
                onClick={onClick}
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
            const entry = this.getEntryByPath(this.state.tree, this.state.curPath)
            content = (<List
                header = {<Title>{entry.name}</Title>}
                dataSource={entry.content}
                renderItem={(item) => this.renderEntry(item)}
            />)
        }

        let rightCol;
        if (this.state.testCard) {
            rightCol = ( <Card
                title={this.state.testCard.name}
                actions={[
                    <Button
                        onClick={async ()=>this.state.testRunner({
                            testMode: 'practice',
                            testFile: await this.loadTestFile(this.state.testCard.name)
                        })}
                    >Тренировка</Button>,
                    <Button
                        onClick={async ()=>this.state.testRunner({
                            testMode: 'exam',
                            testFile: await this.loadTestFile(this.state.testCard.name)
                        })}
                    >Тест</Button>,
                    <Button>Статистика</Button>
                ]}
            >

                {this.state.testCard.description}
            </Card>)
        }

        let leftCol = undefined;
        if (this.state.curPath.size > 0) {
            leftCol = ( <Button
                onClick={()=>(this.setState({curPath: this.state.curPath.pop()}))}
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
