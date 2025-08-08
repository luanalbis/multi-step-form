const userExtraAdds = {};
const userPlan = { type: 'arcade', period: 'monthly', price: 9 };

const pricePlanType = { arcade: 9, advanced: 12, pro: 15 }
const extraAdds = { services: 1, storage: 2, profile: 2 };

const user = { name: undefined, email: undefined, phone: undefined, plan: userPlan, extraAdds: userExtraAdds };

const regexValidators = {
    name: /^[A-Za-zÀ-ÿ\s]{2,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    phone: /^\+?\d{10,15}$/
};
document.querySelectorAll('#form-step1-container input').forEach(input => {
    input.addEventListener('input', function () {
        const btnNextStep = document.getElementById('btn-next-step');
        const field = this.id;
        const value = this.value.trim();
        const isValid = regexValidators[field].test(value);


        if (isValid) {
            user[field] = value;
            this.classList.remove('input-error');
            document.getElementById('txt' + field + 'Required').style.display = 'none';
        } else {
            user[field] = undefined;
            document.getElementById('txt' + field + 'Required').style.display = 'block';
            btnNextStep.disabled = true;
        }
        if (user.name !== undefined && user.email !== undefined && user.phone !== undefined) {
            btnNextStep.disabled = false;
        }
    });
});

document.querySelectorAll('.step3-form-extra-checkbox').forEach(input => {
    input.addEventListener('change', function () {
        const extra = this.id.split('-')[1];

        if (this.checked) {
            const multiplier = userPlan.period === 'monthly' ? 1 : 10;
            userExtraAdds[extra] = Number(extraAdds[extra]) * multiplier;
        } else {
            delete userExtraAdds[extra];
        }
    });
});

document.getElementById("btn-slide-month-year").addEventListener("click", function () {
    this.classList.toggle("active");

    const monthly = document.getElementById('txt-btn-monthly');
    const yearly = document.getElementById('txt-btn-yearly');

    const isMonthlyActive = monthly.classList.contains('txt-btn-active');

    monthly.classList.toggle('txt-btn-active', !isMonthlyActive);
    monthly.classList.toggle('txt-btn-inactive', isMonthlyActive);

    yearly.classList.toggle('txt-btn-active', isMonthlyActive);
    yearly.classList.toggle('txt-btn-inactive', !isMonthlyActive);

    changeUserPlan(isMonthlyActive ? yearly.id : monthly.id);
});

document.querySelectorAll('.step2-card-container').forEach(card => {
    card.addEventListener("click", function () {

        document.querySelectorAll('.step2-card-container').forEach(c => {
            c.classList.remove('card-selected');
        });

        card.classList.add('card-selected');
        userPlan.type = card.id.split('-')[2].toLowerCase();
        updateUserPlan(userPlan.type);
    });
});

function updateUserPlan(type) {
    if (!pricePlanType.hasOwnProperty(type)) { return }
    if (userPlan.period !== 'monthly' && userPlan.period !== 'yearly') { return }

    userPlan.type = type;
    userPlan.price = userPlan.period === 'monthly' ? pricePlanType[type] : pricePlanType[type] * 10;
}

function updateUserExtraAdds() {
    let multiplier = user.plan.period === 'monthly' ? 1 : 10;
    if (user.extraAdds['services']) {
        user.extraAdds['services'] = extraAdds['services'] * multiplier
    }
    if (user.extraAdds['storage']) {
        user.extraAdds['storage'] = extraAdds['storage'] * multiplier
    }
    if (user.extraAdds['profile']) {
        user.extraAdds['profile'] = extraAdds['profile'] * multiplier
    }
}

function changeUserPlan(plan) {
    let displaySpanYearBonus = 'none';
    let priceArcade = 9;
    let priceAdvanced = 12;
    let pricePro = 15;
    let planSufix = '/mo';
    let period = 'monthly';

    if (plan === 'txt-btn-yearly') {
        displaySpanYearBonus = 'block'
        priceArcade *= 10;
        priceAdvanced *= 10;
        pricePro *= 10;
        planSufix = '/yr'
        period = 'yearly';
    }

    Array.from(document.getElementsByClassName('span-bonus-year-plan')).forEach(element => {
        element.style.display = displaySpanYearBonus;
    })

    userPlan.period = period;
    updateUserPlan(userPlan.type);

    document.getElementById('txt-price-arcade').innerHTML = "$" + priceArcade + planSufix;
    document.getElementById('txt-price-advanced').innerHTML = "$" + priceAdvanced + planSufix;
    document.getElementById('txt-price-pro').innerHTML = "$" + pricePro + planSufix;
}

function cleanUserExtraAdds() {
    Object.keys(user.extraAdds).forEach(k => delete user.extraAdds[k]);
    document.querySelectorAll('.step3-form-extra-checkbox').forEach(input => {
        input.checked = false;
    });
}

function updatePickAddOnsPriceForm() {
    let multiplier = user.plan.period === 'monthly' ? 1 : 10;
    let sufix = user.plan.period === 'monthly' ? '/mo' : '/yo';
    let services = extraAdds['services'] * multiplier;
    let storage = extraAdds['storage'] * multiplier;
    let profile = extraAdds['profile'] * multiplier;

    document.getElementById('txt-pick-add-price-services').innerHTML = `$${services}${sufix}`;
    document.getElementById('txt-pick-add-price-storage').innerHTML = `$${storage}${sufix}`;
    document.getElementById('txt-pick-add-price-profile').innerHTML = `$${profile}${sufix}`;
}

function updateFormHeader(step) {
    let txtHeader = '';
    let txtSubHeader = '';
    if (step === 1) {
        txtHeader = "Personal info";
        txtSubHeader = 'Please provider your name, email adress and phone number.';

    } else if (step === 2) {
        txtHeader = "Select your plan";
        txtSubHeader = 'You have the option of monthly or yearly billing';

    } else if (step === 3) {
        txtHeader = "Pick-add ons";
        txtSubHeader = 'Add-ons help enhance your gaming expericence.';

    } else if (step === 4) {
        txtHeader = "Finishing up";
        txtSubHeader = 'Double-check everything looks ok before confirming.';
    }

    document.getElementById('txtHeaderForms').innerHTML = txtHeader;
    document.getElementById('txtSubHeaderForms').innerHTML = txtSubHeader;
}


function updateFormFinishingUp() {
    const extraAddsKeys = ['services', 'storage', 'profile']
    let type = firstLetterToUpper(user.plan.type);
    let period = firstLetterToUpper(user.plan.period);
    let pricePlan = user.plan.price;
    let sufix = period === 'Monthly' ? '/mo' : '/yo'
    let sufixTotal = period === 'Monthly' ? '(Per Month)' : '(Per Year)';

    document.getElementById('txtUserTypePlan').innerHTML = `${type} (${period})`;
    document.getElementById('txtUserPricePlan').innerHTML = `$${pricePlan}${sufix}`;

    let total = pricePlan;
    for (let key of extraAddsKeys) {
        let extraAddsContainer = 'containerUser' + firstLetterToUpper(key);
        let txtExtraPrice = 'txtPriceUser' + firstLetterToUpper(key)
        if (!user.extraAdds[key]) {
            document.getElementById(extraAddsContainer).style.display = 'none'
        } else {
            let keyPrice = user.extraAdds[key];
            total += keyPrice
            document.getElementById(extraAddsContainer).style.display = 'flex'
            document.getElementById(txtExtraPrice).innerHTML = `+$${keyPrice}${sufix}`
        }
    }
    
    document.getElementById('txtTotalPerPeriod').innerHTML = `Total ${sufixTotal}`;
    document.getElementById('txtTotalAllPlan').innerHTML = `$${total}${sufix}`;
}


function changePeriodPlan() {

    user.plan.period = user.plan.period === 'monthly' ? 'yearly' : 'monthly';

    updateUserPlan(user.plan.type);
    updateUserExtraAdds();;
    updateFormFinishingUp();;
}

function goNextOrPreviousForm(step) {
    const currentForm = document.querySelector('form[data-step]:not([style*="display: none"])');
    const currentStep = Number(currentForm.dataset.step);
    const newStep = step > 0 ? currentStep + 1 : currentStep - 1;
    const newForm = document.querySelector(`form[data-step="${newStep}"]`);

    if (newStep < 1 || newStep > 4 || !newForm) return;

    currentForm.style.display = 'none';
    newForm.style.display = 'flex';

    const btnBack = document.getElementById('btn-go-back');
    const footer = document.getElementById('btns-footer-container');
    document.getElementById('btn-next-step').style.display = 'block'
    document.getElementById('btn-confirm-order').style.display = 'none'

    if (newStep > 1) {
        btnBack.style.display = 'block';
        footer.style.justifyContent = 'space-between';
    } else {
        btnBack.style.display = 'none';
        footer.style.justifyContent = 'end';
    }
    document.querySelectorAll('.span-step-circle').forEach(span => {
        span.classList.remove('step-activated');
        if (span.id === 'span-step' + newStep) {
            span.classList.add('step-activated');
        }
    });
    updateFormHeader(newStep);
    if (newStep === 4) {
        document.getElementById('btn-next-step').style.display = 'none'
        document.getElementById('btn-confirm-order').style.display = 'block'
        updateFormFinishingUp()
    };
    if (currentStep === 3 && newStep === 2) { cleanUserExtraAdds() };
    if (newStep === 3) { updatePickAddOnsPriceForm() };
}

function firstLetterToUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function confirmOrder() {
    document.getElementById('confirming-order-container').style.display = 'flex'
    document.getElementById('main-forms-container').style.display = 'none'
}
