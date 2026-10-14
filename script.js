//store info about countries
const countries = [
    {
        name:"Dublin, Ireland",
        city:"Dublin", 
        lat: 53.3331,
        long: -6.2489,
        timezone: "Europe/Dublin",
        isDublin: true
    },

    {
        name:"India",
        city:"New Delhi", 
        lat: 28.6214,
        long: 77.2148,
        timezone: "Asia/Kolkata"
    },

    {
        name:"Singapore",
        city:"Singapore", 
        lat: 1.2897,
        long: 103.8501,
        timezone: "Asia/Singapore"
    },

    {
        name:"Japan",
        city:"Tokyo", 
        lat: 35.6895,
        long: 139.6917,
        timezone: "Asia/Tokyo"
    }
];

//function to fetch weather data from Open-Meteo API

function getWeatherfromOpenMeteo(){

    //find two elements in my html file, container for cards and status for loading message
    let container=document.getElementById("weatherContainer");
    let status=document.getElementById("status");

    //this refreshes the cards when refresh button is clicked, so that the new data can be displayed
    container.innerHTML= "";

    status.textContent="Loading weather data";

    //loop through the countries array and fetch weather data for each country

    for(let i =0; i<countries.length; i++){

        let country=countries[i];

        //made a url that requests the current weather data for each country using the Open-Meteo API
        let url="https://api.open-meteo.com/v1/forecast"+
            "?latitude="+country.lat+
            "&longitude="+country.long+
            "&current=temperature_2m,rain,relative_humidity_2m"+
            "&timezone="+country.timezone;

        //sends request to the Open-Meteo API and handles the response
        fetch(url)

        //check if request sucessful, if yes then convert the response to JSON which is data that my javascript can use, if not then throw an error
        .then(function(response){

            if(response.ok){
                return response.json();
            }
            else{
                throw new Error("the data is not available");
            }
        })

        //read the returned data and create a card for each country with the weather data, if the data is not available then throw an error
        .then(function(data){ //data has API response
 
            if(!data.current){ //data.current has current weather data, if it is not available then throw an error
                throw new Error("Current weather data unavailable");
            }


            let weather=data.current;
            let date=weather.time.substring(0,10); //if API returns time in format "2023-06-15T12:00", then date is first 10 characters and time is last 5 characters
            let time=weather.time.substring(11,16);

            //create a card for each country with the weather data, if the data is not available then throw an error
            let card=document.createElement("div");
            card.className=country.isDublin ? "dublin" : "card";

            //add the country name, city, date, time and weather data to the card
            card.innerHTML=
            "<h2>"+country.name+"</h2>"+
            "<p>City: "+country.city+"</p>"+
            "<p>Date: "+date+"</p>"+
            "<p>Time: "+time+"</p>";

            //if the country is not Dublin, then add the weather data to the card

            if(!country.isDublin){
                card.innerHTML+=
                "<p class='temperature'>"+ weather.temperature_2m +"°C</p>"+
                "<p>Rain: "+weather.rain+"mm</p>"+
                "<p>Humidity: "+weather.relative_humidity_2m+"%</p>";
            }

            //add the card to the container and update the status message to indicate that the weather data has been loaded successfully
            container.appendChild(card); //parent element is container, child element is card

            status.textContent="Weather data loaded successfully";

        })

        //if there is an error fetching the weather data, log the error to the console and update the status message to indicate that there was an error loading the weather data for that country
        .catch(function(error){
            console.error("Error fetching weather data for "+country.name+":", error);
            status.textContent="Error loading weather data for "+country.name;
        });
    }
}

//call the function to fetch weather data from Open-Meteo API when the page loads and refresh button also calls this function to fetch the latest weather data when clicked
getWeatherfromOpenMeteo();