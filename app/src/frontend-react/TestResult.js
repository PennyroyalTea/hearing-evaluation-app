import React from 'react';
import {Button,
    Typography,
    Result
} from "antd";

const {Title} = Typography;

function TestResult(props) {
    let treshold;

    if (props.testMode === 'exam') {
        treshold = <Tresholdfeedback th={props.config.settings.treshold} ca={props.correctAnswers}/>;
    }

    return (
        <div align='center'>
            <Title>
                Конец {props.testMode === 'exam' ? 'теста' : 'обучения'}!
            </Title>
            <Title>Правильных ответов: {props.correctAnswers} из {props.config.questions.length} ({(100 * props.correctAnswers / props.config.questions.length).toFixed(1)} %)
            </Title>
            <Title>Среднее время ответа: {(props.answerSpeeds.reduce((sum, cur)=>sum+cur) / props.answerSpeeds.size / 1000).toFixed(1)} с.</Title>
            {treshold}
            <Button
                onClick={()=>props.handleReturnClick()}
            >
                Вернуться в меню
            </Button>
        </div>
    )
}

function Tresholdfeedback(props) {
    if (!props.th) {
        return (<Result
            status='info'
            title='У теста не было порога прохождения, вы справились!'
        />);
    }
    if (props.th > props.ca) {
        return (<Result
            status='error'
            title={`Порог прохождения: ${props.th}. Пока не получилось.`}
        />);
    } else {
        return (<Result
            status='success'
            title={`Вы набрали больше ${props.th} правильных ответов и успешно выполнили тест!`}
        />);
    }
}

export default TestResult;