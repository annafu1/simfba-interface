import React from "react";

const landingPageBody = () => {
  return (
    <div className="container">
      <div className="alert alert-info text-center" role="alert">
        To deploy your own copy, and learn the fundamentals of the Heroku
        platform, head over to the{" "}
        <a
          href="https://devcenter.heroku.com/articles/getting-started-with-nodejs"
          class="alert-link"
        >
          Getting Started with Node on Heroku
        </a>{" "}
        tutorial.
      </div>
      <div className="row">
        <div className="col-md-6">
          <h3>
            <span className="glyphicon glyphicon-info-sign"></span> How this
            sample app works
          </h3>
          <ul>
            <li>
              This app was deployed to Heroku, either using Git or by using{" "}
              <a href="https://github.com/heroku/node-js-getting-started">
                Heroku Button
              </a>{" "}
              on the repository.
            </li>

            <li>
              When Heroku received the source code, it fetched all the
              dependencies in the{" "}
              <a href="https://github.com/heroku/node-js-getting-started/blob/master/package.json">
                package.json
              </a>
              , creating a deployable slug.
            </li>
            <li>
              The platform then spins up a dyno, a lightweight container that
              provides an isolated environment in which the slug can be mounted
              and executed.
            </li>
            <li>
              You can scale your app, manage it, and deploy over{" "}
              <a href="https://addons.heroku.com/">150 add-on services</a>, from
              the Dashboard or CLI.
            </li>
          </ul>
        </div>
        <div className="col-md-6">
          <h3>
            <span className="glyphicon glyphicon-link"></span> Next Steps
          </h3>
          <ul>
            <li>
              If you are following the{" "}
              <a href="https://devcenter.heroku.com/articles/getting-started-with-nodejs">
                Getting Started
              </a>{" "}
              guide, then please head back to the tutorial and follow the next
              steps!
            </li>
            <li>
              If you deployed this app by deploying the Heroku Button, then in a
              command line shell, run:
            </li>
            <ul>
              <li>
                <code>
                  git clone
                  https://github.com/heroku/node-js-getting-started.git
                </code>{" "}
                - this will create a local copy of the source code for the app
              </li>
              <li>
                <code>cd node-js-getting-started</code> - change directory into
                the local source code repository
              </li>
              <li>
                <code>heroku git:remote -a &lt;your-app-name></code> - associate
                the Heroku app with the repository
              </li>
              <li>
                You'll now be set up to run the app locally, or{" "}
                <a href="https://devcenter.heroku.com/articles/getting-started-with-nodejs#push-local-changes">
                  deploy changes
                </a>{" "}
                to Heroku
              </li>
            </ul>
          </ul>
          <h3>
            <span class="glyphicon glyphicon-link"></span> Helpful Links
          </h3>
          <ul>
            <li>
              <a href="https://www.heroku.com/home">Heroku</a>
            </li>
            <li>
              <a href="https://devcenter.heroku.com/">Heroku Dev Center</a>
            </li>
            <li>
              <a href="https://devcenter.heroku.com/articles/getting-started-with-nodejs">
                Getting Started with Node on Heroku
              </a>
            </li>
            <li>
              <a href="https://devcenter.heroku.com/articles/deploying-nodejs">
                Deploying Node Apps on Heroku
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default landingPageBody;
