import React from "react";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

function App() {
  const validationSchema = Yup.object().shape({
    fullname: Yup.string().required("Fullname is required"),
    username: Yup.string()
      .required("Username is required")
      .min(6, "Username must be at least 6 characters")
      .max(20, "Username must not exceed 20 characters"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Confirm Password does not match"),
    education: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Education is required"),
      })
    ),
    company: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Company is required"),
      })
    ),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(validationSchema),
    // mode: "onBlur",
    criteriaMode:"firstError"
  });

  const formValues = useWatch({
    control,
  });

  console.log(formValues);

  const onSubmit = (data) => {
    console.log(JSON.stringify(data, null, 2));
  };

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education", // The name of the field array
  });


  const {
    fields: companyFields,
    append: appendCompany,
    remove: removeCompany,
  } = useFieldArray({
    control,
    name: "company", // The name of the field array
  });

  return (
    <div className="register-form">
      {isSubmitSuccessful ? (
        <div className="text-center text-success">
          <h4>Submit Successfully</h4>
        </div>
      ) : (
        ""
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            name="fullname"
            type="text"
            {...register("fullname")}
            className={`form-control ${errors.fullname ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.fullname?.message}</div>
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            name="username"
            type="text"
            {...register("username")}
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.username?.message}</div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="text"
            {...register("email")}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            {...register("password")}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            className={`form-control ${
              errors.confirmPassword ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.confirmPassword?.message}
          </div>
        </div>

        <div className="form-group form-check">
          <input
            name="designation"
            type="checkbox"
            {...register("designation")}
            className={`form-check-input`}
            disabled={formValues.working}
          />
          <label htmlFor="designation" className="form-check-label">
            I am student
          </label>
        </div>


        {formValues.designation && (
          <div>
            <h4>
              Education{" "}
              <button
                type="button"
                className="btn btn-sm btn-success ml-2 float-right"
                onClick={() => appendEducation({ name: "" })}
              >
                Add
              </button>
            </h4>

            {educationFields.map((field, index) => (
              <div key={field.id} className="my-4">
                <label>Education Institute</label>
                <div className="d-flex">
                  <div>
                    <input
                      className={`form-control ${
                        errors.education && errors.education[index]?.name
                          ? "is-invalid"
                          : ""
                      }`}
                      {...register(`education[${index}].name`)} // Registering each input field with a unique name
                      defaultValue={field.name} // Setting the default value for each input field
                    />
                    <div className="invalid-feedback">
                      {errors.education && errors.education[index] && (
                        <p>
                          {errors.education &&
                            errors.education[index]?.name?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <button
                      type="button"
                      className="btn  btn-danger"
                      onClick={() => removeEducation(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="form-group form-check">
          <input
            name="working"
            type="checkbox"
            {...register("working")}
            className={`form-check-input`}
            disabled={formValues.designation}
          />
          <label htmlFor="working" className="form-check-label">
            I am working in company
          </label>
        </div>

       

        {formValues.working && (
          <div>
            <h4>
              Company{" "}
              <button
                type="button"
                className="btn btn-sm btn-success ml-2 float-right"
                onClick={() => appendCompany({ name: "" })}
              >
                Add
              </button>
            </h4>

            {companyFields.map((field, index) => (
              <div key={field.id} className="my-4">
                <label>Company Name</label>
                <div className="d-flex">
                  <div>
                    <input
                      className={`form-control ${
                        errors.company && errors.company[index]?.name
                          ? "is-invalid"
                          : ""
                      }`}
                      {...register(`company[${index}].name`)} // Registering each input field with a unique name
                      defaultValue={field.name} // Setting the default value for each input field
                    />
                    <div className="invalid-feedback">
                      {errors.company && errors.company[index] && (
                        <p>
                          {errors.company &&
                            errors.company[index]?.name?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <button
                      type="button"
                      className="btn  btn-danger"
                      onClick={() => removeCompany(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100 mt-5">
          Register
        </button>
        <button
          type="button"
          onClick={reset}
          className="btn btn-warning w-100 mt-4"
        >
          Reset
        </button>
      </form>
    </div>
  );
}

export default App;
