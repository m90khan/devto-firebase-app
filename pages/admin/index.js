import AuthCheck from '@components/AuthCheck';
import PostFeed from '@components/PostFeed';
import { UserContext } from '@lib/context';
import { auth, firestore, serverTimestamp } from '@lib/firebase';
import kebabCase from 'lodash.kebabcase';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast';
import styled from 'styled-components';

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
  const query = ref.orderBy('createdAt');
  const [querySnapshot] = useCollection(query);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data);

    toast.success('Post created!');

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <FormContainer onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='My Awesome Article!'
        className='input'
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type='submit' disabled={!isValid} className='btn-green'>
        Create New Post
      </button>
    </FormContainer>
  );
}

const FormContainer = styled.form`
  .container {
    min-height: 100vh;
    display: flex;
  }

  .container section {
    width: 60vw;
    margin-right: 1rem;
  }

  .container aside {
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

  .input {
    outline: none;
    border: none;
    font-size: 2.5rem;
    width: 100%;
    padding: 5px 10px;
  }

  @media only screen and (max-width: 768px) {
    .container {
      flex-direction: column;
    }

    .container section {
      width: 100%;
    }

    .container aside {
      width: 100%;
      position: relative;
    }
  }
`;
