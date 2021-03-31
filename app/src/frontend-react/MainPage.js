import React from "react";

import {Row, Col, Spin, Button, List, Typography} from 'antd'

import {mockFolderStructure} from "./Mock";

const {Title} = Typography;

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            tree: undefined,
            curPath: []
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
        return (<List.Item>
            <Button
                type={(entry.type === 'test' ? 'primary' : '')}
                onClick={() => console.log(`go to ${entry.name}`)}
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
            // TODO: some logic to show tree
            // content = JSON.stringify(this.state.tree)
            content = (<List
                header = {<Title>{this.getEntryByPath(this.state.tree, this.state.curPath).name}</Title>}
                dataSource={this.getEntryByPath(this.state.tree, this.state.curPath).content}
                renderItem={(item) => this.renderEntry(item)}
            />)
        }

        return (
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={8} style={{backgroundColor: '#fee'}}>
                    COL1
                </Col>
                <Col span={8}>
                    {content}
                </Col>
                <Col span={8} style={{backgroundColor: '#fee'}}>
                    COL3
                </Col>
            </Row>
        )
    }
}

export default MainPage;