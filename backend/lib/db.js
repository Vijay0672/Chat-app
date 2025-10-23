import mongoose from "mongoose"

//function to connect  to the mongoDB data base
export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('database is connected'))

        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (error) {
        console.log(error)
    }
}
