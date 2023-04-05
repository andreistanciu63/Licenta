const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users '
    },
    status: {
        type: String,
        default: 'public'
      },
    date: {
        type: Date,
        default: Date.now
    },

});

mongoose.model("ideas", IdeaSchema);