using System.Collections.Generic;
using System.Linq;
using MongoDB.Bson;

namespace ProstasiaApi
{
    public class Identity
    {
        public ObjectId _id { get; set; }
        private string _identityLabel;
        private string _ownerUsername;
        private List<Password> _passwords;
        private List<SecureNote> _secureNotes;
        
        public string identityLabel
        {
            get { return _identityLabel; }
            set { _identityLabel = value; }
        }

        public string ownerUsername
        {
            get { return _ownerUsername; }
            set { _ownerUsername = value; }
        }
        public List<Password> passwords
        {
            get { return _passwords; }
            set { _passwords = value; }
        }
        
        public List<SecureNote> secureNotes
        {
            get { return _secureNotes; }
            set { _secureNotes = value; }
        }

        public Identity(string username, string label)
        {
            this._id = new ObjectId();
            this.identityLabel = label;
            this.ownerUsername = username;
            this.passwords = new List<Password>();
            this.secureNotes = new List<SecureNote>();
        }
        
        public Identity()
        {
            this._id = new ObjectId();
            this.passwords = new List<Password>();
            this.secureNotes = new List<SecureNote>();
        }
    }
}