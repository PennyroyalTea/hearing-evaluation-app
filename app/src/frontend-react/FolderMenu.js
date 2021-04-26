import React from "react";

import {List as ImmutableList} from "immutable";

import {
    Button,
    Col,
    Row,
    List,
    Spin,
    Typography,
    Breadcrumb,
    Modal,
    Popover
} from "antd";

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
        let res;
        res = await window.backend.loadDirStructure(this.props.tfolder.path)
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

    handleBreadcrumbClick(entryName) {
        let newPathList = this.state.curPathList;
        while (newPathList.size > 0 && newPathList.get(-1) !== entryName) {
            newPathList = newPathList.pop();
        }
        this.setState({
            curPathList: newPathList
        })
    }

    render() {
        let bc = (
            <Breadcrumb style={{fontSize: 22}}>
                <Breadcrumb.Item href=''
                    key={'root'}
                    onClick={(e)=>{
                        e.preventDefault();
                        this.handleBreadcrumbClick();
                    }}
                >
                    {this.state.loaded ? this.getEntryByPath(this.state.tree, []).name : ''}
                </Breadcrumb.Item>
                {this.state.curPathList.map(entry=>{
                    return (
                        <Breadcrumb.Item href=''
                            key={entry}
                            onClick={(e)=>{
                                e.preventDefault();
                                this.handleBreadcrumbClick(entry);
                            }}
                        >
                            {entry}
                        </Breadcrumb.Item>
                    )
                })}
            </Breadcrumb>
        )

        let content;

        if (!this.state.loaded) {
            content = <Spin delay={100} size="large"/>
        } else {
            const entry = this.getEntryByPath(this.state.tree, this.state.curPathList)
            content = (<List
                dataSource={entry.content}
                renderItem={(item) => this.renderEntry(item)}
            />)
        }


        let testPath = this.state.testCard ? path.join.apply(
            null,
            [this.props.tfolder.path].concat(this.state.curPathList.toJS()).concat([this.state.testCard.name])
        ) : undefined;

        let modal = (
            <Modal
                visible={this.state.testCard}
                title={this.state.testCard?.name}
                onCancel={()=>{this.setState({testCard: undefined})}}
                footer={[
                    <Button key='practice'
                            onClick={async ()=>this.props.testRunner({
                                testMode: 'practice',
                                testPath: testPath,
                                config: await this.loadTestFile(testPath)
                            })}
                    >
                        Тренировка
                    </Button>,
                    <ExamButton
                        testPath={testPath}
                        {...this.props}
                        testFileLoader={(testPath) => this.loadTestFile(testPath)}
                    />
                ]}
            >
                {this.state.testCard?.description}
            </Modal>
        )

        let backBtn = (<Button
            onClick={()=>(this.setState({curPathList: this.state.curPathList.pop()}))}
            disabled={this.state.curPathList.size === 0}
        >Назад</Button>)


        return (
            <>
                <Row>
                    <Col span={4} align='center'>
                        {backBtn}
                    </Col>
                    <Col span={20} align='center'>
                        <Row>
                            <Col span={24}>
                                <Title>{bc}</Title>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                {content}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {modal}
            </>
        )
    }
}

class ExamButton extends React.Component {
    render() {
        const btn = (
            <Button key='exam'
                    disabled={!this.props.currentUser}
                    onClick={async ()=>this.props.testRunner({
                        testMode: 'exam',
                        testPath: this.props.testPath,
                        config: await this.props.testFileLoader(this.props.testPath)
                    })}
            >
                Тест
            </Button>
        );

        if (this.props.currentUser) {
            return btn;
        } else {
            return (
                <Popover
                    content={'Выберите пациента во вкладке "пациенты"'}
                    trigger='hover'
                >
                    {btn}
                </Popover>
            )
        }
    }
}