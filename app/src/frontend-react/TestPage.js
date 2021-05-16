import React from "react";
import {message, Image, Typography, List, Button, Col, Row} from "antd";

const _ = require('lodash');
const path = require('path');

const {Title} = Typography;

export class TestPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            config: this.props.config,
            questionId: 0,
            correctAnswers: 0,
            ended: false
        }
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


    handleNextClick() {
        let correct = true;
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

        if (this.props.testMode === 'practice') {
            if (correct) {
                message.success('Правильно!', 2)
            } else {
                message.error('Неправильно :(', 2)
            }
        } else {
            message.warn('Ответ принят!', 2)
        }

        const questionsTotal = this.state.config.questions.length
        if (this.state.questionId + 1 === questionsTotal) {
            this.setState({
                ended: true
            })
        } else {
            this.setState({
                questionId: this.state.questionId + 1
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
            ts: Date.now()
        } : {})
    }

    handleAudioEnded() {
        console.log('ended:)')
    }

    renderAnswer(answer) {
        const isSelected = this.state[`img_${answer.image}`];

        return (<List.Item>
            <Image
                width={'180px'}
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
            return (
                <div align='center'>
                    <Title>
                        Конец {this.props.testMode === 'exam' ? 'теста' : 'обучения'}!
                    </Title>
                    <Title>Правильных ответов: {this.state.correctAnswers} из {this.state.config.questions.length} ({(100 * this.state.correctAnswers / this.state.config.questions.length).toFixed(1)} %)
                    </Title>
                    <Button
                        onClick={()=>this.handleReturnClick()}
                    >
                        Вернуться в меню
                    </Button>
                </div>
            )
        }

        return (
            <>
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
                            column: 3}}
                        dataSource={this.state.config.questions[qId].answers}
                        renderItem={(answer)=>this.renderAnswer(answer)}
                    />
                </Row>
            </>
        )
    }
}

class AudioPlayer extends React.Component {
    constructor(props) {
        super(props);

        let audio = new Audio(this.props.src)
        audio.onended = this.props.onended;

        this.state = {
            audio: audio,
            clicked: false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.src !== this.props.src) {
            this.setState({
                audio: new Audio(this.props.src),
                clicked: false
            })
        }
    }

    handleClick() {
        this.setState({
            clicked: true
        })
        this.state.audio.play()
    }

    render() {
        return (
            <Button
                size='large'
                disabled = {this.state.clicked && this.props.once}
                onClick={() => this.handleClick()}
            >
                Звук
            </Button>
        )
    }
}