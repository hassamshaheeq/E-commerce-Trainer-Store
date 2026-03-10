import mongoose from 'mongoose';

const heroSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: false
    },
    subtitle: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Hero = mongoose.model('Hero', heroSchema);

export default Hero;
