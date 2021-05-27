import React from "react";

import {List,
    Card,
    Button,
    Space,
    Typography,
    Modal,
    Form,
    Input} from 'antd'

const {Text, Title} = Typography

export default class PatientsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: undefined,
            showUser: undefined,
            showUserCreateModal: undefined
        }
    }

    async componentDidMount() {
        await this.loadUserList()
    }

    async loadUserList() {
        const res = await window.backend.getUsers()
        this.setState({
            users: res
        })
    }

    async loadUserById(id) {
        const res = await window.backend.getUserById(id)
        this.setState({
            showUser: res
        })
    }

    async handleCardClick(userId) {
        console.log(`card click on id ${userId}`)
        await this.loadUserById(userId)
    }

    async handleNewPatientClick() {
        this.setState({
            showUserCreateModal: true
        })
    }

    async handleDeleteUserClick(userId) {
        await window.backend.removeUserById(userId)
        await this.loadUserList()
        this.setState({
            showUser: undefined
        })
    }

    async handleChooseUserClick(userId) {
        await this.props.userChooser(userId);
        this.setState({
            showUser: undefined
        })
    }

    async handleNewPatientSubmit(values) {
        console.log(`patient to create: ${JSON.stringify(values)}`)
        await window.backend.addUser(JSON.parse(JSON.stringify(values))) // TODO: fix parse(stringify) cloning
        console.log(`successfully created`)
        await this.loadUserList()
        this.setState({showUserCreateModal: false})
    }

    renderPatient(patient) {
        return (<List.Item key={patient.id}>
            <Card hoverable onClick={()=>this.handleCardClick(patient.id)} align='center'>
                <Text strong>{patient.surname}</Text>
                <br/>
                {patient.name}
                <br/>
                {patient.patronal}
            </Card>
        </List.Item>)
    }

    render() {
        const layout = {
            labelCol: {
                span: 8,
            },
            wrapperCol: {
                span: 16,
            },
        };
        const tailLayout = {
            wrapperCol: {
                offset: 8,
                span: 16,
            },
        };

        return (

            <Space direction='vertical' style={{width: '100%'}} align='center' size='large'>
                {this.props.currentUser ?
                    (<Title level={3} type={'success'}>
                        Текущий пациент: {this.props.currentUser.surname} {this.props.currentUser.name}
                    </Title>) :
                    (<Title level={3} type={'danger'}>Текущий пациент не выбран</Title>)
                }
                <Button size='large' onClick={() => this.handleNewPatientClick()}>
                    Добавить нового пациента
                </Button>
                <List
                    grid={{gutter: 16}}
                    dataSource={this.state.users}
                    renderItem={patient => this.renderPatient(patient)}
                />
                {/* show user modal */}
                <Modal
                    visible={this.state.showUser}
                    onCancel={() => this.setState({showUser: undefined})}
                    footer={[
                        <Button onClick={async () => await this.handleDeleteUserClick(this.state.showUser?.id)}>
                            Удалить
                        </Button>,
                        <Button type='primary' onClick={async () => await this.handleChooseUserClick(this.state.showUser?.id)}>
                            Выбрать
                        </Button>
                    ]}
                >
                    {this.state.showUser?.id || ''}
                    <br />
                    {this.state.showUser?.surname || ''}
                    <br />
                    {this.state.showUser?.name || ''}
                    <br />
                    {this.state.showUser?.patronal || ''}
                    <br />
                    {this.state.showUser?.birthday || ''}
                </Modal>
                {/* create new user modal */}
                <Modal
                    title='Добавить нового пациента'
                    visible={this.state.showUserCreateModal}
                    onCancel={() => this.setState({showUserCreateModal: false})}
                    footer={null}
                >
                    <Form
                        {...layout}
                        onFinish={async (values) => await this.handleNewPatientSubmit(values)}
                    >
                        <Form.Item
                            {...tailLayout}
                            label='Фамилия'
                            name='surname'
                            rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста, введите фамилию!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            {...tailLayout}
                            label='Имя'
                            name='name'
                            rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста, введите имя!',
                                },
                            ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            {...tailLayout}
                            label='Отчество'
                            name='patronal'
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            {...tailLayout}
                            label='Дата рождения'
                            name='birthday'
                            rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста, выберите дату рождения.',
                                },
                            ]}
                        >
                            <Input type='date'/>
                        </Form.Item>
                        <Form.Item
                            {...tailLayout}
                        >
                            <Button type='primary' htmlType={"submit"}>
                                    Создать
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Space>

        )
    }
}