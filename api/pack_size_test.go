package api

import (
	"bytes"
	"database/sql"
	"encoding/json"
	mockdb "github.com/enginbulut/gymshark/db/mock"
	db "github.com/enginbulut/gymshark/db/sqlc"
	"github.com/enginbulut/gymshark/token"
	"github.com/enginbulut/gymshark/util"
	"github.com/gin-gonic/gin"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/require"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

// TODO: we could add tests for the other endpoints as well, but I believe that helped you to understand the point
func TestCreatePackSize(t *testing.T) {
	packSize := randomPackSize(t)
	user, _ := randomUser(t)

	testCases := []struct {
		name          string
		body          gin.H
		setupAuth     func(t *testing.T, request *http.Request, tokenMaker token.Maker)
		buildStubs    func(store *mockdb.MockStore)
		checkResponse func(t *testing.T, recoder *httptest.ResponseRecorder)
	}{
		{
			name: "Created",
			body: gin.H{
				"name":     packSize.Name,
				"quantity": packSize.Quantity,
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Email, user.ID, user.Role, user.FullName, time.Minute)
			},
			buildStubs: func(store *mockdb.MockStore) {
				arg := db.CreatePackSizeParams{
					Name:     packSize.Name,
					Quantity: 5,
				}
				store.EXPECT().
					CreatePackSize(gomock.Any(), gomock.Eq(arg)).
					Times(1).
					Return(packSize, nil)
			},
			checkResponse: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusCreated, recorder.Code)
				requireBodyMatchPackSize(t, recorder.Body, packSize)
			},
		},
		{
			name: "InternalError",
			body: gin.H{
				"name":     packSize.Name,
				"quantity": packSize.Quantity,
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, user.Email, user.ID, user.Role, user.FullName, time.Minute)
			},
			buildStubs: func(store *mockdb.MockStore) {
				store.EXPECT().
					CreatePackSize(gomock.Any(), gomock.Any()).
					Times(1).
					Return(db.PackSize{}, sql.ErrConnDone)
			},
			checkResponse: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusInternalServerError, recorder.Code)
			},
		},
		{
			name: "UnauthorizedUser",
			body: gin.H{
				"name":     packSize.Name,
				"quantity": packSize.Quantity,
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
				addAuthorization(t, request, tokenMaker, authorizationTypeBearer, "unauthorized-email", 0, 0, "", time.Minute)
			},
			buildStubs: func(store *mockdb.MockStore) {
			},
			checkResponse: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusForbidden, recorder.Code)
			},
		},
		{
			name: "NoAuthorization",
			body: gin.H{
				"name":     packSize.Name,
				"quantity": packSize.Quantity,
			},
			setupAuth: func(t *testing.T, request *http.Request, tokenMaker token.Maker) {
			},
			buildStubs: func(store *mockdb.MockStore) {
			},
			checkResponse: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recorder.Code)
			},
		},
	}

	for i := range testCases {
		tc := testCases[i]

		t.Run(tc.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			store := mockdb.NewMockStore(ctrl)
			tc.buildStubs(store)

			//start test server and send request
			server := newTestServer(t, store)
			recorder := httptest.NewRecorder()

			// Marshal body data to JSON
			data, err := json.Marshal(tc.body)
			require.NoError(t, err)

			url := "/pack_sizes"
			request, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(data))
			require.NoError(t, err)

			tc.setupAuth(t, request, server.tokenMaker)
			server.router.ServeHTTP(recorder, request)
			tc.checkResponse(t, recorder)
		})
	}
}

func randomPackSize(t *testing.T) (packSize db.PackSize) {
	name := util.RandomFullName()
	packSize = db.PackSize{
		Name:     name,
		Quantity: 5,
	}
	return
}

func requireBodyMatchPackSize(t *testing.T, body *bytes.Buffer, packSize db.PackSize) {
	data, err := io.ReadAll(body)
	require.NoError(t, err)

	var gotPackSize db.PackSize
	err = json.Unmarshal(data, &gotPackSize)
	require.NoError(t, err)
	require.Equal(t, packSize, gotPackSize)
}
