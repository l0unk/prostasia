using MongoDB.Bson;

namespace ProstasiaApi
{
    public class Password
    {
        public string _id { get; set; }
        private string _site;
        private string _nickname;
        private string _username;
        private string _password;

        public string site
        {
            get => _site;
            set => _site = value;
        }

        public string nickname
        {
            get { return _nickname; }
            set { _nickname = value; }
        }
        
        public string username
        {
            get { return _username; }
            set { _username = value; }
        }
        public string password
        {
            get { return _password; }
            set { _password = value; }
        }

        public Password(string site, string username, string password, string nickname = "", string id = "")
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                this._id = ObjectId.GenerateNewId().ToString();
            }
            else
            {
                this._id = id;
            }
            _site = site;
            _username = username;
            _password = password;
            _nickname = nickname;
        }
        
        public Password()
        {
            if (string.IsNullOrWhiteSpace(this._id))
            {
                this._id = ObjectId.GenerateNewId().ToString();
            }
        }
    }
}