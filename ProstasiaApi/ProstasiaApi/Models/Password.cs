namespace ProstasiaApi
{
    public class Password
    {
        private string _site;
        private string _username;
        private string _password;
        private string _email;

        public string site
        {
            get => _site;
            set => _site = value;
        }

        public string email
        {
            get { return _email; }
            set { _email = value; }
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

        public Password(string site, string username, string password, string email)
        {
            _site = site;
            _username = username;
            _password = password;
            _email = email;
        }
    }
}