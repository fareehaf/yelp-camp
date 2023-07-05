const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')
const User = require('../models/user')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>
{
    console.log("Database connected");
});



const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () =>
{
    await Campground.deleteMany({});
    await User.deleteMany({});
    const user = await User.register(new User({
        username: 'fido',
        email: 'fido@gmail.com'
    }), 'fido');

    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const { city, state, latitude, longitude } = cities[random1000];

        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${city}, ${state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, iure laboriosam assumenda eaque ipsam animi quaerat velit facere eveniet. Dolores sunt molestiae unde nihil repellat dolor fugiat sapiente, corrupti saepe.',
            price,
            author: user._id,
            geometry: { type: 'Point', coordinates: [longitude, latitude] },
            images: [
                {
                    url: 'https://res.cloudinary.com/durjerzor/image/upload/v1687627582/YelpCamp/ik9qhegveanikneu5fyp.jpg',
                    filename: 'YelpCamp/ik9qhegveanikneu5fyp'
                },
                {
                    url: 'https://res.cloudinary.com/durjerzor/image/upload/v1687627589/YelpCamp/je1rxeifrryhvoz6l4o2.jpg',
                    filename: 'YelpCamp/je1rxeifrryhvoz6l4o2'
                }
            ]
        })
        await camp.save();
    }
}

seedDb().then(() =>
{
    mongoose.connection.close();
});