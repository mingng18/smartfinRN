// Function to store a document in Firestore
async function storeDocument(collection, document) {
    const url = `https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/${collection}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(document),
    });

    if (response.ok) {
        console.log('Document stored successfully!');
    } else {
        console.error('Failed to store document:', response.status);
    }
}

// Function to retrieve a document from Firestore
async function retrieveDocument(collection, documentId) {
    const url = `https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/${collection}/${documentId}`;
    
    const response = await fetch(url);

    if (response.ok) {
        const data = await response.json();
        console.log('Retrieved document:', data);
    } else {
        console.error('Failed to retrieve document:', response.status);
    }
}

// Function to edit a document in Firestore
async function editDocument(collection, documentId, updatedDocument) {
    const url = `https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/${collection}/${documentId}`;
    
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDocument),
    });

    if (response.ok) {
        console.log('Document edited successfully!');
    } else {
        console.error('Failed to edit document:', response.status);
    }
}



// // Example usage
// const myDocument = {
//     name: 'John Doe',
//     age: 30,
// };

// storeDocument('users', myDocument);
// retrieveDocument('users', 'documentId');
