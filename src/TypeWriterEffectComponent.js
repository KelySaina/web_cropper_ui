import Typewriter from 'typewriter-effect';

const TypeWriterEffectComponent = ({ text }) => {
    return (
        <Typewriter
            options={{
                strings: text.split(':'),
                autoStart: true,
                loop: true,
                delay: 60,
            }}
        />
    );
}

export default TypeWriterEffectComponent;
