import React from "react";
import {
    Image,
    Typography,
    List,
    Button,
    Col,
    Row,
    Modal, Space
} from "antd";

import {List as ImmutableList} from 'immutable';

import AudioPlayer from "./AudioPlayer";
import TestResult from "./TestResult";

const _ = require('lodash');
const path = require('path');



const {Title} = Typography;

const getColumnsSize = (x) => {
    if (x < 7) {
        return x;
    }
    if (x < 19 && x % 3 === 0) {
        return Math.floor(x / 3);
    }
    if (x < 13) {
        if (x % 2 === 0) {
            return Math.floor(x / 2);
        } else {
            return Math.floor((x + 1) / 2);
        }
    }
    for (let d of [6, 5, 4, 3]) {
        if (x % d === 0) return d;
        if ((x + 1) % d === 0) return d;
    }

    return 6;
};

export class TestPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            config: this.props.config,
            questionId: 0,
            correctAnswers: 0,
            answerSpeeds: ImmutableList(),
            ended: false,
            showImages: this.props.config.settings.delay === undefined,
            soundPlayed: false,
            questionResult: undefined
        }
        console.log(`show images: ${this.props.config.settings.delay === undefined}`)
    }

    componentDidMount() {
        let needShuffling =
            (this.props.testMode === 'practice' && this.state.config.settings.shuffleTraining) ||
            (this.props.testMode === 'exam' && this.state.config.settings.shuffleTesting);

        if (this.state.config.settings.shareImages) {
        //    generate this.state.config.questions from this.state.config.questionsShared
            console.log(`questionsShared: \n\n ${JSON.stringify(this.state.config.questionsShared)}`)
            let questions = this.state.config.questionsShared.sounds.map((sound, id) => {
                return {
                    sound: sound,
                    answers: this.state.config.questionsShared.images.map(imagePath => {
                        console.log(`${JSON.stringify(this.state.config.questionsShared.answers[id])} : ${imagePath} : ${path.basename(imagePath)}`)
                        return {
                            image: imagePath,
                            correct: this.state.config.questionsShared.answers[id].includes(path.basename(imagePath))
                        }
                    })
                }
            })
            this.setState({
                config: {...this.state.config, ...{questions: needShuffling ? _.shuffle(questions) : questions}}
            })
            console.log(`config: \n\n ${JSON.stringify(this.state.config)}`)
        } else {
            if (needShuffling) {
                this.setState({
                    config: {...this.state.config, ...{questions: _.shuffle(this.state.config.questions)}}
                })
            }
        }

        this.setState({
            loaded: true
        })
    }

    handleImageClick(image) {
        if (!this.state.soundPlayed) return;

        if (!this.state.config.settings.multipleAnswers) {
            this.setState({
                [`img_${image}`]: true
            }, ()=>{
                this.handleNextClick();
            })
            return;
        }

        if (this.state[`img_${image}`]) {
            this.setState({
                [`img_${image}`]: false
            })
        } else {
            this.setState({
                [`img_${image}`]: true
            })
        }

    }


    async handleNextClick() {
        this.setState({
            answerSpeeds: this.state.answerSpeeds.push(
                Date.now() - this.state.soundPlayedTimestamp - (this.state.config.settings?.delay || 0)
            )
        })

        let correct = true;

        console.log(`answers: ${JSON.stringify(this.state.config.questions[this.state.questionId].answers)}`)
        for (let answer of this.state.config.questions[this.state.questionId].answers) {
            let isSelected = this.state[`img_${answer.image}`] || false
            if (isSelected !== answer.correct) {
                correct = false;
                break;
            }
        }

        let erasedSelections = {}
        for (let answer of this.state.config.questions[this.state.questionId].answers) {
            erasedSelections[`img_${answer.image}`] = undefined
        }

        this.setState(erasedSelections)

        if (correct) {
            this.setState({
                correctAnswers: this.state.correctAnswers + 1
            })
        }

        const questionsTotal = this.state.config.questions.length

        let result;

        if (this.props.testMode === 'practice') {
            if (correct) {
                result = {
                    type: '+',
                    color: 'green',
                    title: 'Правильный ответ',
                    description: 'правильно!',
                    src: 'succFace.jpeg'
                }
            } else {
                result = {
                    type: '-',
                    color: 'red',
                    title: 'Неправильный ответ',
                    description: 'неверно :(',
                    src: 'failFace.jpeg'
                }
            }
        } else {
            result = {
                type: '?',
                color: 'black',
                title: 'Ответ принят',
                description: 'Ответ принят.',
                src: 'confFace.jpeg'
            }
        }

        this.setState({
            questionResult: result
        })

        await new Promise(r => setTimeout(r, 1000));

        this.setState( {questionResult: undefined});

        if (this.state.questionId + 1 === questionsTotal) {
            this.setState({
                ended: true
            })
        } else {
            this.setState({
                questionId: this.state.questionId + 1,
                showImages: this.state.config.settings.delay === undefined,
                soundPlayed: false
            })
        }
    }

    handleQuitClick() {
        this.props.testEnder(false, this.props.testMode, {})
    }

    handleReturnClick() {
        this.props.testEnder(true, this.props.testMode, this.props.testMode === 'exam' ? {
            userId: this.props.currentUser.id,
            testId: this.state.config.name,
            succ: this.state.correctAnswers,
            all: this.state.config.questions.length,
            threshold: this.state.config.settings.threshold,
            averageSpeed: this.state.answerSpeeds.reduce((sum, cur)=>sum+cur) / this.state.answerSpeeds.size,
            ts: Date.now()
        } : {})
    }

    handleAudioEnded() {
        console.log('sound ended')
        if (this.state.config.settings.delay !== undefined) {
            setTimeout(() => {this.setState({showImages: true})}, this.state.config.settings.delay * 1000)
        }
        this.setState({
            soundPlayed: true,
            soundPlayedTimestamp: Date.now()
        })
    }

    renderAnswer(answer) {
        const isSelected = this.state[`img_${answer.image}`];
        const isVisible = this.state.showImages;

        if (!isVisible) {
            return (<List.Item>
                <div style={{backgroundColor: "black", width: "150px", height: "150px"}}/>
            </List.Item>);
        }

        return (<List.Item>
            <Image
                width={'150px'}
                preview={false}
                src={path.join(
                    'file://',
                    this.props.tfolder.path,
                    this.state.config.settings.resourceDir,
                    answer.image)}
                onClick={()=>this.handleImageClick(answer.image)}
                style={{border: isSelected ? 'solid' : ''}}
            />
        </List.Item>)
    }

    render() {
        const qId = this.state.questionId;

        if (!this.state.loaded) {
            return (
                <div>Загрузка</div>
            )
        }

        if (this.state.ended) {
            return <TestResult
                testMode={this.props.testMode}
                correctAnswers={this.state.correctAnswers}
                config={this.state.config}
                answerSpeeds={this.state.answerSpeeds}
                handleReturnClick={()=>this.handleReturnClick()}
            />
        }

        return (
            <Space direction='vertical' style={{width: '100%'}}>
                <Modal
                    visible={this.state.questionResult}
                    // title={this.state.questionResult?.title}
                    closable={false}
                    footer={null}
                    width={300}
                >
                    <Space direction='vertical'>
                        <Title level={2} style={{color: this.state.questionResult?.color}}>{this.state.questionResult?.description}</Title>
                        <Image src={this.state.questionResult?.src} preview={false}/>
                    </Space>

                </Modal>
                <Row>
                    <Col span={1}/>
                    <Col span={4} align='left'>
                        <Button size='large' onClick={() => this.handleQuitClick()}>
                            &larr; Выйти досрочно
                        </Button>
                    </Col>
                    <Col span={14} align='center'>
                        <Title level={3}>
                            Вопрос {qId + 1} / {this.state.config.questions.length}
                        </Title>
                    </Col>
                    <Col span={4} align='center'>
                        <Title level={4}>
                            Режим: {this.props.testMode === 'practice' ? 'Обучение' : 'Тестирование'}
                        </Title>
                    </Col>
                    <Col span={1}/>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={9}/>
                    <Col span={this.state.config.settings.multipleAnswers ? 3 : 6} align={'center'}>
                        <AudioPlayer
                            once={this.props.testMode === 'exam'}
                            src={path.join(
                                'file://',
                                this.props.tfolder.path,
                                this.state.config.settings.resourceDir,
                                this.state.config.questions[qId].sound
                            )}
                            onended={() => this.handleAudioEnded()}
                        />
                    </Col>
                    <Col span={this.state.config.settings.multipleAnswers ? 3 : 0}>
                        {
                            this.state.config.settings.multipleAnswers ? (
                                <Button
                                    size='large'
                                    onClick={()=>this.handleNextClick()}
                                >
                                    Принять ответ
                                </Button>
                            ) : ''
                        }
                    </Col>
                    <Col span={9}/>
                </Row>
                <Row justify='center'>
                    <List
                        align='center'
                        grid={{
                            gutter: 16,
                            column: getColumnsSize(this.state.config.questions[qId].answers.length)}}
                        dataSource={this.state.config.questions[qId].answers}
                        renderItem={(answer)=>this.renderAnswer(answer)}
                    />
                </Row>
            </Space>
        )
    }
}
