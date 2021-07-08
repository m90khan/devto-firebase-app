import AuthCheck from '@components/AuthCheck';
import ImageUploader from '@components/ImageUploader';
import { auth, firestore, serverTimestamp } from '@lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore
    .collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts')
    .doc(slug);
  const [post] = useDocumentDataOnce(postRef); // only fetch data when component is initially initialized

  return (
    <PostManagerContainer>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? 'Edit' : 'Preview'}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className='btn-blue'>Live view</button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </aside>
        </>
      )}
    </PostManagerContainer>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, errors, handleSubmit, formState, reset, watch } = useForm({
    defaultValues,
    mode: 'onChange',
  });

  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully!');
  };

  return (
    <PostFormContainer onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className='card'>
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? 'hidden' : 'controls'}>
        <ImageUploader />

        <textarea
          name='content'
          ref={register({
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required' },
          })}
        ></textarea>

        {errors.content && <p className='text-danger'>{errors.content.message}</p>}

        <fieldset>
          <input className='checkbox' name='published' type='checkbox' ref={register} />
          <label>Published</label>
        </fieldset>

        <button type='submit' className='btn-green' disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </PostFormContainer>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm('are you sure!');
    if (doIt) {
      await postRef.delete();
      router.push('/admin');
      toast('post annihilated ', { icon: '🗑️' });
    }
  };

  return (
    <button className='btn-red' onClick={deletePost}>
      Delete
    </button>
  );
}

const PostFormContainer = styled.form`
  .hidden {
    display: none;
  }

  .controls {
    display: flex;
    flex-direction: column;
  }

  .checkbox {
    display: inline;
    width: auto;
  }
`;

const PostManagerContainer = styled.main`
  min-height: 100vh;
  display: flex;

  section {
    width: 60vw;
    margin-right: 1rem;
  }

  aside {
    display: flex;
    flex-direction: column;
    width: 20%;
    min-width: 250px;
    min-height: 200px;
    text-align: center;
    position: sticky;
    top: 80px;
    height: 0;
  }

  .controls textarea {
    height: 60vh;
    border: none;
    outline: none;
    padding: 0.5rem;
    font-size: 1.25rem;
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column;

    section {
      width: 100%;
    }

    aside {
      width: 100%;
      position: relative;
    }
  }
`;
