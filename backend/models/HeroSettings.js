import mongoose from 'mongoose';

const heroSettingsSchema = mongoose.Schema({
    title: {
        type: String,
        default: 'Step Into Style'
    },
    subtitle: {
        type: String,
        default: 'Discover premium footwear for every occasion.'
    }
}, {
    timestamps: true
});

const HeroSettings = mongoose.model('HeroSettings', heroSettingsSchema);

export default HeroSettings;
