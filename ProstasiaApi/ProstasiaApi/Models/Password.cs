namespace ProstasiaApi
{
    public class Password
    {
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

        public Password(string site, string username, string password, string nickname = "")
        {
            _site = site;
            _username = username;
            _password = password;
            _nickname = nickname;
        }
        
        public Password()
        {
        }
    }
}