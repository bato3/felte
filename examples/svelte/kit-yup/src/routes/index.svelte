<script lang="ts">
    import { createForm } from 'felte';
    import { ValidationMessage, reporter } from '@felte/reporter-svelte';
    import { validator } from '@felte/validator-yup';
    import * as yup from 'yup';
  
    type Data = {
      email: string;
      password: string;
    }
  
    let submitted: Data | undefined;
  
    const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required()
      .test('is-secure', 'password is not secure', (value) =>
        value ? value.length > 8 : true
      ),
  });
  
  const { form, errors, data, setErrors, ...context } = createForm<yup.InferType<typeof schema>>({
  //const { form } = createForm<Data>({
    async onSubmit(values) {
      submitted = values;
      console.log({values})
      const resp = await fetch('/example', {
          method:'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
          
          //
      })
      errors.update(e => {e.email = ['dupa', ...e.email]; return e})
      setErrors('password', 'nie te hasło')
      //$errors.email = ['dupa', ...$errors.email ]

      const data = await resp.json();
      console.log({data, resp})
    },
    extend: [validator({ schema }), reporter], 
  });
  //console.log({form, context});
  
    function handleSuccess(event) {
      const { response, ...context } = event.detail;
      // Do something with the response.
      console.log({response, context})
    }
  
    function handleError(event) {
      const { error, ...context } = event.detail;
      // `FelteSubmitError` contains a `response` property
      // with the response from `fetch`
      console.error({error, context})
      const response = error.response;
      // Do something with the error
    }
  
    
  </script>
  
  <main>
    <h1>Basic Example - Svelte</h1>
    <form use:form 
    
    on:felteerror="{handleError}">
      <fieldset>
        <legend>Sign In</legend>
        <label for="email">Email:</label>
        <input type="email" name="email" id="email" />
        <ValidationMessage for="email" let:messages={messages}>
          <span slot="placeholder">Some placeholder text</span>
          <ul aria-live="polite">
            {#each messages ?? [] as message}
              <li>{message}</li>
            {/each}
          </ul>
        </ValidationMessage>
        <label for="password">Password:</label>
        <input type="password" name="password" id="password" />
        <ValidationMessage for="password" let:messages={messages}>
          <ul aria-live="polite">
            {#each messages ?? [] as message}
              <li>{message}</li>
            {/each}
          </ul>
        </ValidationMessage>
      </fieldset>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
    {#if submitted}
      <section>
        <h2>Submitted values</h2>
        <pre>{JSON.stringify(submitted, null, 2)}</pre>
      </section>
    {/if}
    <h2>$errors</h2>
    <pre>{JSON.stringify($errors)}</pre>
    <h2>$data</h2>
    <pre>{JSON.stringify($data)}</pre>
  </main>
  