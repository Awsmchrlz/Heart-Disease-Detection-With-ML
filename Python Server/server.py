from fastapi import FastAPI
from pydantic import BaseModel
import pickle

app = FastAPI()

class Features(BaseModel):
    age: int
    sex: int
    chest_pain_type_non_anginal: int
    chest_pain_type_atypical_anginal: int
    chest_pain_type_typical_anginal: int
    resting_blood_pressure: float
    cholesterol: float
    fasting_blood_sugar: float
    resting_ecg_normal: float
    resting_ecg_lvh: float
    max_heart_rate: float
    exercise_anginal: float
    st_depression: int
    st_slope_flat: float
    st_slope_upslopping: float

# Loading the model
with open('heart_disease_model.sav', 'rb') as model_file:
    heart_disease_model = pickle.load(model_file)

# First endpoint
@app.post('/runprediction')
def predict(inputs: Features):
    try:
        input_dict = inputs.model_dump()

        age = input_dict['age']
        sex = input_dict['sex']
        chest_pain_type_non_anginal = input_dict['chest_pain_type_non_anginal']
        chest_pain_type_atypical_anginal = input_dict['chest_pain_type_atypical_anginal']
        chest_pain_type_typical_anginal = input_dict['chest_pain_type_typical_anginal']
        resting_blood_pressure = input_dict['resting_blood_pressure']
        cholesterol = input_dict['cholesterol']
        fasting_blood_sugar = input_dict['fasting_blood_sugar']
        resting_ecg_normal = input_dict['resting_ecg_normal']
        resting_ecg_lvh = input_dict['resting_ecg_lvh']
        max_heart_rate = input_dict['max_heart_rate']
        exercise_anginal = input_dict['exercise_anginal']
        st_depression = input_dict['st_depression']
        st_slope_flat = input_dict['st_slope_flat']
        st_slope_upslopping = input_dict['st_slope_upslopping']

        input_list = [
            age, sex, chest_pain_type_non_anginal, chest_pain_type_atypical_anginal, chest_pain_type_typical_anginal,
            resting_blood_pressure, cholesterol, fasting_blood_sugar, resting_ecg_normal, resting_ecg_lvh,
            max_heart_rate, exercise_anginal, st_depression, st_slope_flat, st_slope_upslopping
        ]

        prediction = heart_disease_model.predict([input_list])

        if prediction[0] == 0:
            result = 'Unlikely to have heart disease.'
        else:
            result = 'Likely to have heart disease.'

        return {'prediction': result}

    except Exception as e:
        return {'error': 'An error occurred'}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
