import * as React from 'react';
import { Field } from 'formik';

interface TestRunFormProps {
    onChange: <T>(newValue:T, e:React.ChangeEvent) => T;
    name:string;
    label:string;
    value:any;
}

export default class FormikCheckbox extends React.Component<TestRunFormProps, any> {

    render(){
        
        return (
            <Field name={this.props.name}>
                {(args:any) => (
                    <label>
                    <input
                        style={{marginRight: '.6em'}}
                        type="checkbox"
                        {...this.props}
                        checked={args.field.value === this.props.value}
                        onChange={(e) => {
                            // const nextValue = !props.value
                            let value = this.props.onChange(args.field.value, e);
                            args.form.setFieldValue(this.props.name, value);
                        }}
                    />
                    {this.props.label}
                    </label>
                )}
            </Field>
        )
        
    }
}