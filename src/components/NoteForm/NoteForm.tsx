import css from "./NoteForm.module.css";
import {Formik, Form, Field, ErrorMessage, type FormikHelpers} from "formik";
import * as Yup from "yup";
import {createNote} from "../../services/noteService.ts";
import type {NoteFormData} from "../../types/note.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";

interface NoteFormProps {
    onSuccessSubmit: () => void;
}

const validationSchema = Yup.object({
    title: Yup.string()
        .min(3, "Title must be at least 3 characters")
        .max(50, "Title must be at most 50 characters")
        .required("Title is required"),
    content: Yup.string()
        .max(500, "Content must be at most 500 characters"),
    tag: Yup.string()
        .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
        .required("Tag is required"),
});

const initialValues: NoteFormData = {
    title: "",
    content: "",
    tag: "Todo",
};

const NoteForm = ({onSuccessSubmit}: NoteFormProps) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createNote,
        // Invalidate the "notes" query to trigger a refetch
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["notes"]});
            onSuccessSubmit();
        },
    });

    const handleSubmit = async (values: NoteFormData, actions: FormikHelpers<NoteFormData>) => {
        mutation.mutate(values, {
            onSettled: () => {
                actions.setSubmitting(false);
            },});

    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({isSubmitting, isValid}) => (
                <Form className={css.form}>
                    <div className={css.formGroup}>
                        <label htmlFor="title">Title</label>
                        <Field
                            id="title"
                            type="text"
                            name="title"
                            className={css.input}
                        />
                        <ErrorMessage name="title" component="span" className={css.error}/>
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="content">Content</label>
                        <Field
                            id="content"
                            name="content"
                            as="textarea"
                            rows={8}
                            className={css.textarea}
                        />
                        <ErrorMessage name="content" component="span" className={css.error}/>
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="tag">Tag</label>
                        <Field
                            id="tag"
                            name="tag"
                            as="select"
                            className={css.select}
                        >
                            <option value="Todo">Todo</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Shopping">Shopping</option>
                        </Field>
                        <ErrorMessage name="tag" component="span" className={css.error}/>
                    </div>

                    <div className={css.actions}>
                        <button type="button" className={css.cancelButton}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={css.submitButton}
                            disabled={isSubmitting || !isValid}
                        >
                            Create note
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default NoteForm;
