var time = 0;

var money = 25;
var average_revenue = 0;
var pedestrians = 1;
var customer_probability = 0.3;
var ice_cream_drop_chance = 0.35;
var ice_cream_value = 1;
var orders_per_customer = 1;
var millionaire_boost_factor = 0;
var show_recommended_investments = false;
var latest_recommendation = null;

var customer_pedestrian_increment = 0;
var customer_probability_increment = 0;
var lab_stage_increment = 0;
var factory_stage_increment = 0;
var bar_stage_increment = 0;
var anti_lag_option = false;

var factory_ice_cream_machines = 1;
var factory_ice_cream_machine_stability_unit = 0;
var factory_ice_cream_machine_perfection_unit = 0;

var bar_customer_chairs = 1;
var bar_customer_couches = 0;
var bar_ice_cream_flavours = 1;
var bar_decorative_greenery = 0;

var lab_irresistable_attraction = 0;
var lab_incredible_taste = 0;
var lab_valuable_ingredients = 0;
var lab_ice_cream_machine_anti_drop = 0;
var lab_efficient_investment = 0;
var lab_perfect_location = 0;

var current_boost_pedestrians = 0
var remaining_boost_time = 0

var warning_timeout;

function update() {
    let revenue_ice_cream = factory_ice_cream_machines * (1 - ice_cream_drop_chance)
    let revenue_pedestrians = (pedestrians * (current_boost_pedestrians + 1)) * customer_probability * orders_per_customer
    let revenue_customer = (bar_customer_chairs + bar_customer_couches * 5) * orders_per_customer

    if (show_recommended_investments) {
        if (Math.min(revenue_pedestrians, revenue_ice_cream, revenue_customer) == revenue_ice_cream) {
            if (latest_recommendation != "revenue_ice_cream") {
                document.getElementById("display_recommended_investment").innerHTML = "Ice Cream";
                if (current_boost_pedestrians == 0) {
                    document.getElementById("display_recommended_investment").innerHTML += " + Temp. Boost";
                }
                document.getElementById("display_recommended_investment_description").innerHTML = "<b>FACTORY</b>:<br>Invest in more <i>Ice Cream Machines</i> or minimize the <i>Ice Cream Drop Chance</i>!"
            }
            latest_recommendation = "revenue_ice_cream";
        }
        else if (Math.min(revenue_pedestrians, revenue_ice_cream, revenue_customer) == revenue_pedestrians) {
            if (latest_recommendation != "revenue_pedestrians") {
                document.getElementById("display_recommended_investment").innerHTML = "Pedestrians";
                if (current_boost_pedestrians == 0) {
                    document.getElementById("display_recommended_investment").innerHTML += " + Temp. Boost";
                }
                document.getElementById("display_recommended_investment_description").innerHTML = "<b>MARKETING</b>:<br>Invest in Boosts / Advertisements (forever-lasting preferably) or increase the <i>Customer Probability</i>!</span></div>";
            }
            latest_recommendation = "revenue_pedestrians";
        }
        else {
            if (latest_recommendation != "revenue_customer") {
                document.getElementById("display_recommended_investment").innerHTML = "Customers";
                if (current_boost_pedestrians == 0) {
                    document.getElementById("display_recommended_investment").innerHTML += " + Temp. Boost";
                }
                document.getElementById("display_recommended_investment_description").innerHTML = "<b>BAR</b>:<br>Invest in <i>Customer Seating</i> by buying more <i>Customer Chairs</i> or <i>Customer Couches</i>!";
            }
            latest_recommendation = "revenue_customer";
        }
    }
    else {
        document.getElementById("recommended_investment_prefix").setAttribute("style", "display:none;")
    }

    average_revenue = Math.round(Math.min(revenue_pedestrians, revenue_ice_cream, revenue_customer) * 10 * ice_cream_value) / 10;

    document.getElementById("display_revenue").innerHTML = average_revenue;
    document.getElementById("display_money").innerHTML = Math.round(money * 10) / 10;
    document.getElementById("display_ice_cream_drop_chance").innerHTML = Math.round(ice_cream_drop_chance * 1000) / 10;
    document.getElementById("display_ice_cream_speed").innerHTML = factory_ice_cream_machines;
    document.getElementById("display_ice_cream_value").innerHTML = Math.round(ice_cream_value * 10) / 10;
    document.getElementById("display_pedestrian_speed").innerHTML = pedestrians + " (+" + Math.round(pedestrians * current_boost_pedestrians) + ")";
    document.getElementById("display_customer_probability").innerHTML = Math.round(customer_probability * 100);
    document.getElementById("display_max_customers").innerHTML = bar_customer_chairs + 5 * bar_customer_couches;
    if (current_boost_pedestrians != 0) { document.getElementById("display_current_boost").innerHTML = "+" + current_boost_pedestrians * 100 + "% Pedestrians"; }
    else { document.getElementById("display_current_boost").innerHTML = "no active Boost" }
    document.getElementById("display_remaining_boost").innerHTML = remaining_boost_time;
    document.getElementById("display_orders_customer").innerHTML = orders_per_customer;

    document.getElementById("display_factory_machines").innerHTML = factory_ice_cream_machines;
    document.getElementById("display_factory_ice_cream_machine_stability_unit").innerHTML = factory_ice_cream_machine_stability_unit;
    document.getElementById("display_factory_ice_cream_machine_perfection_unit").innerHTML = factory_ice_cream_machine_perfection_unit;
    document.getElementById("display_bar_customer_chairs").innerHTML = bar_customer_chairs;
    document.getElementById("display_bar_customer_couches").innerHTML = bar_customer_couches;
    document.getElementById("display_bar_ice_cream_flavour").innerHTML = bar_ice_cream_flavours;
    document.getElementById("display_bar_decorative_greenery").innerHTML = bar_decorative_greenery;
    document.getElementById("display_lab_irresistable_attraction").innerHTML = lab_irresistable_attraction;
    document.getElementById("display_lab_incredible_taste").innerHTML = lab_incredible_taste;
    document.getElementById("display_lab_valuable_ingredients").innerHTML = lab_valuable_ingredients;
    document.getElementById("display_lab_ice_cream_machine_anti_drop").innerHTML = lab_ice_cream_machine_anti_drop;
    document.getElementById("display_lab_efficient_investment").innerHTML = lab_efficient_investment;
    document.getElementById("display_lab_perfect_location").innerHTML = lab_perfect_location;
}

function warning(txt, color = "orange", stage = 0) {
    clearTimeout(warning_timeout);
    warning_timeout = setTimeout(function () { document.getElementById("display_warning").innerHTML = "" }, 5000);
    document.getElementById("display_warning").innerHTML = txt;
    document.getElementById("display_warning").setAttribute("style", "color:" + color);
    if ((document.getElementById("warning_popup").checked && stage == 0) || document.getElementById("success_popup").checked && stage == 1 || stage == 2) {
        window.alert(txt.replace(/<b>/g, "").replace(/<\/b>/g, ""));
    }
}

function pass() {
    time += 1;
    if (document.getElementById("anti_lag").checked == false) {
        var lack_ice_cream, lack_customer_seatings = false;
        var ice_cream_amount = 0;
        for (let i = 0; i < factory_ice_cream_machines; i++) {
            if (Math.random() < ice_cream_drop_chance) {
                continue
            }
            else { ice_cream_amount += 1 }
        }
        var customer_amount = bar_customer_chairs + 5 * bar_customer_couches;
        if (remaining_boost_time == 0) {
            current_boost_pedestrians = 0;
        }
        else { remaining_boost_time -= 1 }
        var current_pedestrians = pedestrians * (current_boost_pedestrians + 1);
        for (let i = 0; i < current_pedestrians; i++) {
            if (Math.random() < customer_probability) {
                if (customer_amount >= 1) {
                    customer_amount -= 1;
                    if (ice_cream_amount >= orders_per_customer) {
                        ice_cream_amount -= orders_per_customer;
                        money += ice_cream_value * orders_per_customer;
                    }
                    else {
                        lack_ice_cream = true;
                    }
                }
                else {
                    lack_customer_seatings = true;
                }
            }
        }
        if (lack_customer_seatings && lack_ice_cream) {
            warning("Because of <b>too little customer seatings</b> and the lack of <b>ice cream supply</b>, some customers left!")
        }
        else if (lack_customer_seatings == false && lack_ice_cream) {
            warning("Due to the lack of <b>ice cream supply</b>, one or more customers left!")
        }
        else if (lack_customer_seatings && lack_ice_cream == false) {
            warning("Because of <b>too little customer seatings</b>, one or more customers left!")
        }
    }
    else {
        money += average_revenue;
        if (latest_recommendation == "revenue_ice_cream") {
            warning("Due to the lack of <b>ice cream supply</b>, one or more customers left!");
        }
        else if (latest_recommendation == "revenue_customer") {
            warning("Because of <b>too little customer seatings</b>, one or more customers left!");
        }
    }
    if ((time > 30 && customer_pedestrian_increment == 0) || ((time > 90) && customer_pedestrian_increment == 1) || ((time > 220) && customer_pedestrian_increment == 2)) {
        warning("A customer told their friends about your shop (+1 pedestrian per sec forever)!", "green", 2);
        customer_pedestrian_increment += 1;
        pedestrians += 1;
    }
    else if (((time > 60) && customer_probability_increment == 0) || (time > 150 && customer_probability_increment == 1)) {
        warning("A customer loved your ice cream and rated your shop online (+5% customer probability forever)!", "green", 2);
        customer_probability += 0.05;
        customer_probability_increment += 1;
    }
    if ((time == 180 || (time % 300 == 0 && time > 0)) && millionaire_boost_factor != 0) {
        warning("A Millionaire dropped by and gave you <b>" + Math.round(average_revenue * millionaire_boost_factor) + "</b>$!", "green", 2);
        money += average_revenue * millionaire_boost_factor;
    }
    if (average_revenue > 20 && bar_stage_increment == 0) {
        warning("You have unlocked the Customer Probability Upgrades!", "green", 2);
        bar_stage_increment = 1;

        for (i of document.getElementsByName("bar")) { i.hidden = false }
        document.getElementById("bar_stage_1").setAttribute("style", "");
        document.getElementById("bar_stage_1_title").innerHTML = "Customer Probability";
    }
    if (average_revenue > 30 && factory_stage_increment == 0) {
        warning("You have unlocked the Machine Stability Upgrades!", "green", 2);
        factory_stage_increment = 1;

        for (i of document.getElementsByName("factory")) { i.hidden = false }
        document.getElementById("factory_stage_1").setAttribute("style", "");
        document.getElementById("factory_stage_1_title").innerHTML = "Machine Stability";
    }
    if (average_revenue > 50 && lab_stage_increment == 0) {
        warning("You have unlocked the LAB!", "green", 2);
        lab_stage_increment = 1;

        for (i of document.getElementsByName("lab")) { i.hidden = false }
        document.getElementById("section_lab").setAttribute("style", "");
        document.getElementById("lab_title").innerHTML = "-- Lab --";
    }
    if (pedestrians > 1000 && anti_lag_option == false) {
        warning("You can now use Anti-Lag Calculation (automatically enabled for you)!", "green", 2);
        document.getElementById("anti_lag").disabled = false;
        document.getElementById("anti_lag").checked = true;
        anti_lag_option = true;
    }
    update();
}

function purchase(item, price, boost = false) {
    if (document.getElementById("multibuy").checked == true) {
        if (boost == true) { var amount = window.prompt("Do you want to multiply the time of bought effect?") }
        else { var amount = window.prompt("How much would you like to purchase (empty = 1)?") }
        if (amount == "") { amount = 1 }
    }
    else if (document.getElementById("maxbuy").checked == true) {
        var amount = 0;
        while (amount * price <= money) {
            amount += 1;
        }
        amount -= 1;
        if (amount == 0) { return }
    }
    else { amount = 1 }
    amount = parseInt(amount);
    if (isNaN(amount)) {
        warning("Invalid amount! (" + amount + ")", "red");
    }
    else {
        if (money >= amount * price) {
            money -= amount * price
            if (item == "factory_machine") {
                factory_ice_cream_machines += amount;
            }
            else if (item == "factory_ice_cream_machine_stability_unit") {
                if (factory_ice_cream_machine_stability_unit + amount > 15) {
                    warning("Reached Max Amount!", "red");
                    var actual_amount = 15 - factory_ice_cream_machine_stability_unit;
                    money += (amount - actual_amount) * price;
                    factory_ice_cream_machine_stability_unit += actual_amount;
                    ice_cream_drop_chance -= actual_amount * 0.01;
                }
                else {
                    factory_ice_cream_machine_stability_unit += amount;
                    ice_cream_drop_chance -= amount * 0.01;
                }
            }
            else if (item == "factory_ice_cream_machine_perfection_unit") {
                if (factory_ice_cream_machine_perfection_unit + amount > 5) {
                    warning("Reached Max Amount!", "red");
                    var actual_amount = 5 - factory_ice_cream_machine_perfection_unit;
                    money += (amount - actual_amount) * price;
                    factory_ice_cream_machine_perfection_unit += actual_amount;
                    ice_cream_drop_chance -= actual_amount * 0.02;
                }
                else {
                    factory_ice_cream_machine_perfection_unit += amount;
                    ice_cream_drop_chance -= amount * 0.02;
                }
            }
            else if (item == "bar_customer_chair") {
                bar_customer_chairs += amount;
            }
            else if (item == "bar_customer_couch") {
                bar_customer_couches += amount;
            }
            else if (item == "bar_ice_cream_flavour") {
                if (bar_ice_cream_flavours + amount > 11) {
                    warning("Reached Max Amount!", "red");
                    var actual_amount = 11 - bar_ice_cream_flavours;
                    money += (amount - actual_amount) * price;
                    bar_ice_cream_flavours += actual_amount;
                    customer_probability += actual_amount * 0.02;
                }
                else {
                    bar_ice_cream_flavours += amount;
                    customer_probability += amount * 0.02;
                }
            }
            else if (item == "bar_decorative_greenery") {
                if (bar_decorative_greenery + amount > 5) {
                    warning("Reached Max Amount!", "red");
                    var actual_amount = 5 - bar_decorative_greenery;
                    money += (amount - actual_amount) * price;
                    bar_decorative_greenery += actual_amount;
                    customer_probability += actual_amount * 0.04;
                }
                else {
                    bar_decorative_greenery += amount;
                    customer_probability += amount * 0.04;
                }
            }
            else if (item == "boost_1") {
                if (current_boost_pedestrians != 0 && current_boost_pedestrians != 1 + lab_perfect_location / 100) {
                    warning("You have <b>overriden</b> your previous boost!");
                    remaining_boost_time = 0;
                }
                current_boost_pedestrians = 1 + lab_perfect_location / 100;
                remaining_boost_time += 60 * amount * (1 + lab_efficient_investment / 10);
            }
            else if (item == "boost_2") {
                if (current_boost_pedestrians != 0 && current_boost_pedestrians != 2 + lab_perfect_location / 100) {
                    warning("You have <b>overriden</b> your previous boost!");
                    remaining_boost_time = 0;
                }
                current_boost_pedestrians = 2 + lab_perfect_location / 100;
                remaining_boost_time += 60 * amount * (1 + lab_efficient_investment / 10);
            }
            else if (item == "boost_3") {
                if (current_boost_pedestrians != 0 && current_boost_pedestrians != 5 + lab_perfect_location / 100) {
                    warning("You have <b>overriden</b> your previous boost!");
                    remaining_boost_time = 0;
                }
                current_boost_pedestrians = 5 + lab_perfect_location / 100;
                remaining_boost_time += 60 * amount * (1 + lab_efficient_investment / 10);
            }
            else if (item == "boost_4") {
                if (current_boost_pedestrians != 0 && current_boost_pedestrians != 10 + lab_perfect_location / 100) {
                    warning("You have <b>overriden</b> your previous boost!");
                    remaining_boost_time = 0;
                }
                current_boost_pedestrians = 10 + lab_perfect_location / 100;
                remaining_boost_time += 30 * amount * (1 + lab_efficient_investment / 10);
            }
            else if (item == "boost_5") {
                if (current_boost_pedestrians != 0 && current_boost_pedestrians != 100 + lab_perfect_location / 100) {
                    warning("You have <b>overriden</b> your previous boost!");
                    remaining_boost_time = 0;
                }
                current_boost_pedestrians = 100 + lab_perfect_location / 100;
                remaining_boost_time += 30 * amount * (1 + lab_efficient_investment / 10);
            }
            else if (item == "boost_5") {
                if (current_boost_pedestrians != 0 && current_boost_pedestrians != 100 + lab_perfect_location / 100) {
                    warning("You have <b>overriden</b> your previous boost!");
                    remaining_boost_time = 0;
                }
                current_boost_pedestrians = 100 + lab_perfect_location / 100;
                remaining_boost_time += 30 * amount * (1 + lab_efficient_investment / 10);
            }
            else if (item == "boost_6") {
                if (current_boost_pedestrians != 0 && current_boost_pedestrians != 1000 + lab_perfect_location / 100) {
                    warning("You have <b>overriden</b> your previous boost!");
                    remaining_boost_time = 0;
                }
                current_boost_pedestrians = 1000 + lab_perfect_location / 100;
                remaining_boost_time += 10 * amount * (1 + lab_efficient_investment / 10);
            }
            else if (item == "boost_7") {
                warning("+" + amount + " Pedestrian(s) from Sponsorship forever!", "green", 1);
                pedestrians += amount;
            }
            else if (item == "boost_8") {
                warning("+" + amount * 10 + " Pedestrians from Contract forever!", "green", 1);
                pedestrians += 10 * amount;
            }
            else if (item == "boost_9") {
                warning("+" + amount * 100 + " Pedestrians from Promotion forever!", "green", 1);
                pedestrians += 100 * amount;
            }
            else if (item == "lab_irresistable_attraction") {
                if (lab_irresistable_attraction + amount > 10) {
                    warning("Reached Max Amount!", "red");
                    var actual_amount = 10 - lab_irresistable_attraction;
                    money += (amount - actual_amount) * price;
                    lab_irresistable_attraction += actual_amount;
                    customer_probability += actual_amount * 0.01;
                }
                else {
                    lab_irresistable_attraction += amount;
                    customer_probability += amount * 0.01;
                }
            }
            else if (item == "lab_incredible_taste") {
                if (lab_incredible_taste + amount > 2) {
                    warning("Reached Max Amount!", "red");
                    var actual_amount = 2 - lab_incredible_taste;
                    money += (amount - actual_amount) * price;
                    lab_incredible_taste += actual_amount;
                    orders_per_customer += actual_amount;
                }
                else {
                    lab_incredible_taste += amount;
                    orders_per_customer += amount;
                }
            }
            else if (item == "lab_valuable_ingredients") {
                if (lab_valuable_ingredients + amount > 30) {
                    warning("Reached Max Amount!", "red");
                    var actual_amount = 30 - lab_valuable_ingredients;
                    money += (amount - actual_amount) * price;
                    lab_valuable_ingredients += actual_amount;
                    ice_cream_value += actual_amount * 0.05;
                }
                else {
                    lab_valuable_ingredients += amount;
                    ice_cream_value += amount * 0.05;
                }
            }
            else if (item == "lab_ice_cream_machine_anti_drop") {
                if (lab_ice_cream_machine_anti_drop + amount > 10) {
                    warning("Reached Max Amount!", "red");
                    var actual_amount = 10 - lab_ice_cream_machine_anti_drop;
                    money += (amount - actual_amount) * price;
                    lab_ice_cream_machine_anti_drop += actual_amount;
                    ice_cream_drop_chance -= actual_amount * 0.005;
                }
                else {
                    lab_ice_cream_machine_anti_drop += amount;
                    ice_cream_drop_chance -= amount * 0.005;
                }
            }
            else if (item == "lab_efficient_investment") {
                if (lab_efficient_investment + amount > 10) {
                    warning("Reached Max Amount!", "red");
                    var actual_amount = 10 - lab_efficient_investment;
                    money += (amount - actual_amount) * price;
                    lab_efficient_investment += actual_amount;
                }
                else {
                    lab_efficient_investment += amount;
                }
            }
            else if (item == "lab_perfect_location") {
                if (lab_perfect_location + amount > 20) {
                    warning("Reached Max Amount!", "red");
                    var actual_amount = 20 - lab_perfect_location;
                    money += (amount - actual_amount) * price;
                    lab_perfect_location += actual_amount;
                }
                else {
                    lab_perfect_location += amount;
                }
            }
        }
        else {
            warning("Not enough money! (" + amount * price + "$)", "red")
        }
    }
    update();
}

function play(lvl) {
    if (lvl == 1) {
        show_recommended_investments = true;
        factory_ice_cream_machines = 10;
        bar_customer_chairs = 10;
        pedestrians = 10;
        money = 200;
        millionaire_boost_factor = 100;
    }
    else if (lvl == 2) {
        factory_ice_cream_machines = 2;
        bar_customer_chairs = 2;
        pedestrians = 2;
        money = 50;
        millionaire_boost_factor = 50;
    }
    else {
        money = 15;
        millionaire_boost_factor = 0;
    }
    document.getElementById("select_mode").setAttribute("style", "display:none");
    document.getElementById("game").setAttribute("style", "");
    update();
    setInterval(pass, 1000);
}